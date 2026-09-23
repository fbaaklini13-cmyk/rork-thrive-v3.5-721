#!/usr/bin/env python3
"""
Move a screen from constants/colors (light) to constants/theme (dark), the same way
Home, Nutrition and Profile were moved by hand -- written down as rules so the result is
consistent and reviewable, not a find-and-replace.

The one judgement a find-and-replace gets wrong: Colors.white means two different things.
On a card it is a BACKGROUND (-> the raised canvas). On a green button it is TEXT
(-> dark ink on the lit accent, because white on #19C59A fails contrast). So every style
block is read as a unit, and its name decides which it is.

Filled green hero cards (the old "caloriesCard" pattern) become raised cards with ink
text and an accent bar -- the Home hero's pattern -- rather than a big lit-green slab,
because the system has one green light and it belongs to actions and data.

Usage: python3 scripts/migrate_to_dark.py <file.tsx> [...]   (edits in place, prints a report)
"""
import re
import sys

BUTTONISH = re.compile(r'(button|btn|cta|fab|chip(?!s)|pill)', re.I)
TEXTISH = re.compile(r'(text|label|title)$', re.I)
FILLISH = re.compile(r'(fill)$', re.I)
TRACKISH = re.compile(r'(bar|track|progress|divider|separator)$', re.I)


def migrate_block(name, body):
    """Rewrite one `name: { ... }` style block. Returns (new_body, notes)."""
    notes = []
    is_button = bool(BUTTONISH.search(name)) and not TEXTISH.search(name)
    is_button_text = bool(BUTTONISH.search(name)) and bool(TEXTISH.search(name))
    is_root = 'flex: 1' in body and name.lower() in ('container', 'root', 'screen', 'safearea', 'wrapper', 'content')

    def bg(m):
        tok = m.group(1)
        if tok == 'primary':
            return 'backgroundColor: Palette.accent' if is_button or FILLISH.search(name) else 'backgroundColor: Palette.canvasRaised'
        if tok == 'secondary':
            return 'backgroundColor: Palette.accentDeep'
        if tok == 'white':
            if FILLISH.search(name):
                return 'backgroundColor: Palette.accent'
            return 'backgroundColor: Palette.canvasRaised'
        if tok == 'lightGrey':
            if is_root:
                return 'backgroundColor: Palette.canvas'
            if TRACKISH.search(name):
                return 'backgroundColor: Palette.line'
            return 'backgroundColor: Palette.canvasRaised'
        if tok in ('mediumGrey', 'darkGrey'):
            return 'backgroundColor: Palette.lineStrong'
        return m.group(0)

    def fg(m):
        tok = m.group(1)
        if tok == 'white':
            return 'color: Palette.canvas' if is_button_text else 'color: Palette.ink'
        return {'primary': 'color: Palette.accent', 'secondary': 'color: Palette.accent',
                'darkGrey': 'color: Palette.ink', 'mediumGrey': 'color: Palette.inkMuted',
                'lightGrey': 'color: Palette.inkFaint', 'success': 'color: Palette.good',
                'warning': 'color: Palette.warn', 'error': 'color: Palette.bad'}.get(tok, m.group(0))

    def border(m):
        prop, tok = m.group(1), m.group(2)
        return f"{prop}: " + {'primary': 'Palette.accent', 'secondary': 'Palette.accent',
                              'lightGrey': 'Palette.line', 'mediumGrey': 'Palette.lineStrong',
                              'darkGrey': 'Palette.lineStrong', 'white': 'Palette.line'}.get(tok, f'Colors.{tok}')

    out = re.sub(r'backgroundColor:\s*Colors\.(\w+)', bg, body)
    out = re.sub(r'(?<![A-Za-z])color:\s*Colors\.(\w+)', fg, out)
    out = re.sub(r'(border(?:Top|Bottom|Left|Right)?Color):\s*Colors\.(\w+)', border, out)
    # a translucent white track sat on a green slab; on a raised card it is a line
    out = re.sub(r"backgroundColor:\s*'rgba\(255,\s*255,\s*255,\s*0?\.\d+\)'", 'backgroundColor: Palette.line', out)
    # a raised card with a radius and no border gets the hairline the migrated screens use
    if 'Palette.canvasRaised' in out and 'borderRadius' in out and 'borderWidth' not in out:
        out = out.rstrip().rstrip(',') + ',\n    borderWidth: 1,\n    borderColor: Palette.line,\n  '
        notes.append(f'{name}: raised card + hairline')
    # shadows were for white-on-grey depth; on a dark canvas they read as mud
    if 'Palette.canvasRaised' in out and 'shadowColor' in out:
        out = re.sub(r"\n\s*shadow(Color|Offset|Opacity|Radius):[^\n]*", '', out)
        out = re.sub(r"\n\s*elevation:[^\n]*", '', out)
        notes.append(f'{name}: shadow removed')
    return out, notes


def migrate(src):
    notes = []
    # 1. the stylesheet, block by block
    m = re.search(r'StyleSheet\.create\(\{', src)
    if m:
        head, tail = src[:m.end()], src[m.end():]
        def block(mm):
            new, n = migrate_block(mm.group(1), mm.group(2))
            notes.extend(n)
            return f"{mm.group(1)}: {{{new}}}"
        tail = re.sub(r'(\w+):\s*\{([^{}]*)\}', block, tail)
        src = head + tail
    # 2. JSX: stack headers go dark
    src = re.sub(r'headerStyle:\s*\{\s*backgroundColor:\s*Colors\.\w+\s*\}',
                 'headerStyle: { backgroundColor: Palette.canvas }', src)
    src = re.sub(r'headerTintColor:\s*Colors\.\w+', 'headerTintColor: Palette.ink', src)
    # 3. JSX icon / spinner colours
    src = src.replace('color={Colors.primary}', 'color={Palette.accent}')
    src = src.replace('color={Colors.mediumGrey}', 'color={Palette.inkMuted}')
    src = src.replace('color={Colors.darkGrey}', 'color={Palette.ink}')
    # white icons in JSX all sit inside green buttons in these screens (checked by hand)
    n_white = src.count('color={Colors.white}')
    src = src.replace('color={Colors.white}', 'color={Palette.canvas}')
    if n_white:
        notes.append(f'{n_white} white icon(s) -> canvas: CHECK each sits on an accent button')
    src = re.sub(r'\?\s*Colors\.mediumGrey\s*:\s*Colors\.primary', '? Palette.inkMuted : Palette.accent', src)
    src = re.sub(r'\?\s*Colors\.primary\s*:\s*Colors\.mediumGrey', '? Palette.accent : Palette.inkMuted', src)
    # 4. import
    src = src.replace("import { Colors } from '@/constants/colors';", "import { Palette } from '@/constants/theme';")
    left = re.findall(r'Colors\.\w+', src)
    if left:
        notes.append('UNMAPPED: ' + ', '.join(sorted(set(left))))
    return src, notes


if __name__ == '__main__':
    for path in sys.argv[1:]:
        src = open(path, encoding='utf-8').read()
        new, notes = migrate(src)
        open(path, 'w', encoding='utf-8').write(new)
        print(f'{path}: {len(notes)} notes')
        for n in notes:
            print('   ', n)
