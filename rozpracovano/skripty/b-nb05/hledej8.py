from fractions import Fraction as F
from itertools import product
def mix(x):
  w=x.numerator//x.denominator; return (w, x-w)
ms=[(w,F(n,d)) for w in (1,2,3) for d in range(2,9) for n in range(1,d) if F(n,d).denominator==d]
for (a,b),(c,d) in product(ms,ms):
  if (a,b)>=(c,d): continue
  x=(a+b)*(c+d)
  w,fr=mix(x)
  if fr==0 or x>8: continue
  po=a*c+b*d
  if po==x: continue
  zs=(w, F(fr.numerator, x.numerator))  # whole + r / N
  if zs[1].numerator!=fr.numerator: continue
  print(f"{a} {b} * {c} {d} = {x} = {w} {fr} | po {mix(po)} | zpet {w} {fr.numerator}/{x.numerator}")
