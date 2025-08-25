# On Lisp Rosetta Stone (lisp/js/cell)

## 2.2 Defining Functions

```lisp
(defun double (x) (* x 2))

> (double 1)
2

> #'double
#<Interpreted-Function C66ACE>
```

```js
var double = function (x) {
    return x * 2;
}

> double (1)
2

> double
[Function: double]
```

```cell
double @ do x . @ * . x
                    . 2

= 2
@ double 1

= x 1
@ double
```

```lisp
> (eq #’double (car (list #’double)))
T
```

```js
> double === [double] [0]
true
```

```cell
// "We don't have a way to put parenthesis around a call. We'd need something like `(@ double) 1` to replicate this. So we instead use a separate variable, which works as a parenthesis.

@ "double list" 1 @ double
= 1
       = ...
@ eq - @ double
         = ...
     - @ "double list" 1
```

```lisp
(lambda (x) (* x 2))
```

```js
function (x) {
    return x * 2;
}
```

```cell
= x 1
@ do x . @ * - @ x
             - 2
```

```lisp
> #’(lambda (x) (* x 2))
#<Interpreted-Function C674CE>
```

```js
> (function (x) {return x * 2})
[Function (anonymous)]
```

```cell
= x 1
@ do x . @ * - @ x
             - 2
```

```lisp
> (double 3)
6
```

```js
> double (3)
6
```

```cell
= 6
@ double 3
```

```lisp
> ((lambda (x) (* x 2)) 3)
6
```

```js
> (function (x) {
     return x * 2;
  }) (3);
```

```cell
= 6
??
@ call do x . @ * . @ x
                  . 2
       m 3
```

## 2.3 Functional Arguments

```
(+ 1 2)

1 + 2;

= 3
@ + . 1
    . 2
```

```
(apply #’+ ’(1 2))
(apply (symbol-function ’+) ’(1 2))
(apply #’(lambda (x y) (+ x y)) ’(1 2))

(function (a, b) {
    return a + b;
}).apply (null, [1, 2]);

= 3
@ call do m . @ + @ m
       v . 1
         . 2
```

```
(mapcar #’(lambda (x) (+ x 10))
        ’(1 2 3))


(function (x) {
    return x.map (function (v) {
        return v + 10;
    });
}) ([1, 2, 3]);

= . 11
  . 12
  . 13
@ call do x . loop do v @ + . @ v
                            . 10
       v . 1
         . 2
         . 3
```

```
(mapcar #’+
        ’(1 2 3)
        ’(10 100 1000))
(11 102 1003)

(function (f, l1, l2) {
    return l1.map (function (v, k) {
        return f (v, l2 [k]);
    });
}) (
   function (a, b) {return a + b},
   [10, 100, 1000],
   [1, 2, 3]
);

@ call do ??
```
