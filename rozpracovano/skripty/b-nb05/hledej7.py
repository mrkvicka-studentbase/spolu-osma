from fractions import Fraction as F
from itertools import product
fr=[F(n,d) for d in range(2,13) for n in range(1,d) if F(n,d).denominator==d]
out=set()
for a,c in product(fr,fr):
  top=a-c
  if top<=0 or a.denominator==c.denominator: continue
  if max(a.denominator,c.denominator)%min(a.denominator,c.denominator)==0: pass
  for e,g in product(fr,fr):
    if e>=g or e.denominator==g.denominator: continue
    bot=e+g
    if bot>=2: continue
    r=top/bot
    if r.denominator>12 or r.numerator>12 or r==1: continue
    bad=F(e.numerator+g.numerator, e.denominator+g.denominator)
    errs=[1/r, top*bot, top/bad]
    if len({r,*errs})<4: continue
    if any(x.denominator>99 or x.numerator>99 for x in errs): continue
    # avoid main numbers
    if {a,c,e,g} & {F(3,4),F(1,6),F(1,2),F(1,3)} == {F(3,4),F(1,6),F(1,2),F(1,3)}: continue
    out.add((str(a),str(c),str(e),str(g),str(top),str(bot),str(r),tuple(map(str,errs))))
L=sorted(out,key=lambda t:(F(t[0]).denominator+F(t[1]).denominator+F(t[2]).denominator+F(t[3]).denominator))
for t in L[:60]: print(t)
