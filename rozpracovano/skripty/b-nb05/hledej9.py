from fractions import Fraction as F
from itertools import product
def mix(x):
  w=x.numerator//x.denominator; return f"{w} {x-w}"
ms=[(w,F(n,d)) for w in (1,2,3,4,5) for d in range(2,9) for n in range(1,d) if F(n,d).denominator==d]
small=[m for m in ms if m[0]<=2]
for A,B,C in product(ms,small,small):
  a=A[0]+A[1]; b=B[0]+B[1]; c=C[0]+C[1]
  if B>=C and False: pass
  bc=b*c; r=a-bc
  if r<=1 or (r-int(r))==0 or bc.denominator>3 and False: continue
  if bc.denominator!=2 and bc.denominator!=1 and bc.denominator!=3 and bc.denominator!=4: continue
  # need cancellation in b*c
  if (B[1].numerator+B[0]*B[1].denominator)*(C[1].numerator+C[0]*C[1].denominator)==bc.numerator: continue
  e1=(a-b)*c
  po=B[0]*C[0]+B[1]*C[1]; e2=a-po
  bs=F(B[0]+B[1].numerator,B[1].denominator); cs=F(C[0]+C[1].numerator,C[1].denominator); e3=a-bs*cs
  vals=[r,e1,e2,e3]
  if min(vals)<=0 or len(set(vals))<4: continue
  if any((v-int(v))==0 for v in vals): continue
  if r>3: continue
  print(f"{A[0]} {A[1]} - {B[0]} {B[1]} * {C[0]} {C[1]} = {mix(r)} | (A-B)C {mix(e1)} | po {mix(e2)} | scit {mix(e3)}")
