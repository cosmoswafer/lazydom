# DOM usage

Two cases:

1. DOM methods shortcut, use normal selector to look up elements
2. Lazy template, look up the template element and update its contents

The shortcuts:

1. Query element and cache them to improve the performance
2. The `dot` method to quickly update set of contents
3. Binding event listeners as well by the above methods

_Remarks:_

1. The lazy template will clone itself and clean up automatically.
