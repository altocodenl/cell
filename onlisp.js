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

map1-n @ : loop call @ m fn
                times @ m n

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

do-ab @ : @ loop call @ : @ print @ m
                 times @ - 1 @ m b
                           2 @ m a

(defun double (x) (* x 2))

var Double = function (x) {
   return x * 2;
}

double @ : * 1 @ m
             2 2

(sort ’(1 4 2 5 6 7 3) #’<)

[1, 4, 2, 5, 6, 7, 3].sort (function (a, b) {
   return a - b;
});

@ sort 1 1
       2 4
       3 2
       4 5
       5 6
       6 7
       7 3

(remove-if #’evenp ’(1 2 3 4 5 6 7))

dale.fil ([1, 2, 3, 4, 5, 6, 7], undefined, function (v) {
   if (v % 2 === 0) return v;
});

@ filter call @ : @ = @ % 1 @ m
                          2 2
         list @ times 7
