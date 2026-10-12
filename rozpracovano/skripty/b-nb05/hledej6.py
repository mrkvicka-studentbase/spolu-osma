from fractions import Fraction as F
import math
def term(x):
    d=x.denominator
    while d%2==0: d//=2
    while d%5==0: d//=5
    return d==1
for Mn in range(3,40):
 for Md in [2,4]:
  M=F(Mn,Md)
  if M.denominator!=Md or M<2 or M>9: continue
  for s in [3,4,5,6,8,10,12]:
   for r in range(1,s):
    P=F(r,s)
    if P.denominator!=s: continue
    Q=M/P; k=math.floor(Q); fr=Q-k
    if fr==0 or k<4 or k>12: continue
    left=M-k*P; buy=P-left
    e1=P/M; e2=M*P
    if not (term(e1) and term(e2)): continue
    errs2=[fr, M-P]
    if len({left,*errs2})<3: continue
    if len({buy,P,left})<3: continue
    print(f"M={M} P={P} Q={Q} k={k} fr={fr} left={left} buy={buy} e1={float(e1)} e2={float(e2)} k2err={errs2}")
