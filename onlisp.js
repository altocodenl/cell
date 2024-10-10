(mapcar
   fn
   (do*
      (
         (x 1 (1+ x))
         (result (list x) (push x result))
      )
      ((= x 10) (nreverse result))
   )
)

var map1_n = function (fn, n) {
   return dale.go (dale.times (n), fn);
}

['map1-n', [
   [['loop', 'times'], ['@@', 2], ['@@', 3]],
]]

1 map1-n
2 1 1 1 loop
      2 times
    2 1 @@
      2 2
    3 1 @@
      2 3

(do
   ((x a (+ 1 x)))
   ((> x b))
   (print x)
)

var do_ab = function (a, b) {
   dale.go (dale.times (b - a), function (v) {
      console.log (v);
   });
}

['do_ab', [
   [['loop', 'times'], [
      [['math', '-'], ['@@', 'b'], ['@@', 'a']],
      ['log', ['@@', 'v']],
   ]],
]]

1 do_ab
2 1 1 1 loop
      2 times
    2 1 1 1 math
          2 -
        2 1 @@
          2 b
        3 1 @@
          2 a
      2 1 log
        2 1 @@
          2 v

(defun double (x) (* x 2))

var Double = function (x) {
   return x * 2;
}

['double', [
   [['math', '*'], ['@@', 'x'], 2] // Where's the return?
]]


(sort ’(1 4 2 5 6 7 3) #’<)

[1, 4, 2, 5, 6, 7, 3].sort (function (a, b) {
   return a - b;
});

(remove-if #’evenp ’(1 2 3 4 5 6 7))

dale.fil ([1, 2, 3, 4, 5, 6, 7], undefined, function (v) {
   if (v % 2 === 0) return v;
});


