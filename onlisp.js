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
   return Array (n).keys ().map (function (x) {
      return fn (x + 1);
   });
}

"map 1 to n" @ do fn n @ loop do @ fn
                              times @ n

@ "map 1 to n" fn @ do n @ + 1 @ n
               n 10

(do
   ((x a (+ 1 x)))
   ((> x b))
   (print x)
)

var do_ab = function (a, b) {
   Array (b - a).keys ().forEach (function (x) {
      console.log (x + 1);
   });
}

"do a b" @ : m @ loop call @ : v @ print @ v
                      times @ - 1 @ m b
                                2 @ m a

(defun double (x) (* x 2))

var Double = function (x) {
   return x * 2;
}

double @ : x @ * 1 @ x
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

Or

@ sort @ list 1 4 2 5 6 7 3

(remove-if #’evenp ’(1 2 3 4 5 6 7))

[1, 2, 3, 4, 5, 6, 7].filter (function (v) {
   return v % 2 === 0;
});

@ filter call @ : = 1 @ % 1 @ list
                          2 2
                    2 0
         list @ times 7
