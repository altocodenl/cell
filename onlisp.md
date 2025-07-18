# On Lisp Rosetta Stone (lisp/js/cell)

## 2.2 Defining Functions

```
(defun double (x) (* x 2))

var double = function (x) {
    return x * 2;
}

double @ do x . @ * . x
                    . 2
```

```
#'double

console.log (double);

@ double
```

```
(lambda (x) (* x 2))

function (x) {
    return x * 2;
}

@ do x . @ * . @ x
             . 2
```

```
((lambda (x) (* x 2)) 3)

(function (x) {
    return x * 2;
}) (3);

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
