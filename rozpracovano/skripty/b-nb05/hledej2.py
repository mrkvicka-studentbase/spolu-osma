from fractions import Fraction as F
from math import gcd, lcm
print("== L1 A: a/b*c/d, a&d share g1 (only-bottom error), c&b share g2")
res=[]
for a in range(2,10):
 for b in range(3,16):
  for c in range(2,10):
   for d in range(3,26):
    if gcd(a,b)!=1 or gcd(c,d)!=1: continue
    g1=gcd(a,d); g2=gcd(c,b)
    if g1<2 or g2<2: continue
    if gcd(a//g1, b//g2)!=1 or gcd(c//g2, d//g1)!=1: continue
    ok=F(a*c,b*d)
    err=F(a*(c//g2),(b//g2)*(d//g1))   # a kept, d divided
    if err.numerator!=a*(c//g2) : continue  # must be basic
    L=lcm(b,d); sj=F((a*L//b)*(c*L//d),L)
    if sj.denominator!=1 or sj>60: continue
    if len({ok,err,sj})<3: continue
    res.append((a,b,c,d,ok,err,sj))
for r in res[:80]: print(r[0],'/',r[1],'*',r[2],'/',r[3],'=',r[4],'err',r[5],'sj',r[6])
