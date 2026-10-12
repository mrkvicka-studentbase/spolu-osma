from fractions import Fraction as F
print("== L1 U2 detektiv: T, 1/a, p/q zbytku")
for T in [150,180,200,210,240,250,280,300,320,350,360,400,420,450,480,500,540,560,600,640,720,800]:
  for a in [3,4,5,6,8,10]:
    for q in [2,3,4,5,6,7,8,9,10]:
      for p in range(1,q):
        if F(p,q).denominator!=q: continue
        s=F(1,a)+F(p,q)
        if s>=1: continue
        X=s*T
        if X.denominator!=1: continue
        t=F(1,a)+F(p,q)*F(a-1,a)
        done=t*T
        if done.denominator!=1: continue
        rem=T-done; Y=T-X
        k2a=F(1,a)+F(p,q)*F(1,a); k2c=F(1+p,a+q)
        if len({rem,Y,done})<3: continue
        if len({t,k2a,k2c})<3: continue
        if (a,p,q)==(6,3,5): continue
        print(T,a,p,q,'petr s',s,'X',X,'Y',Y,'| t',t,'done',done,'rem',rem,'k2',k2a,k2c)
