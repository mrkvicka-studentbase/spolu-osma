from fractions import Fraction as F
from math import lcm
def eq(a,b,msg):
    assert a==b, f"{msg}: {a} != {b}"
# U1
eq(F(3,14)*F(7,15),F(1,10),'A'); eq(F(3*1,2*5),F(3,10),'A krati jen dole: 3/14*7/15 -> 7/14=1/2, 15/5 bez 3 nahore')
L=lcm(14,15); eq(F((3*L//14)*(7*L//15),L),21,'A spol jmen')
eq(6*F(7,9),F(14,3),'B'); eq(F(6*7,6*9),F(7,9),'B cele do obou'); eq(F(54*7,9),42,'B spol jmen 6=54/9')
eq(F(5,7)*70,50,'C'); eq(70//7,10,'C jen del'); eq(F(70,5)*7,98,'C obracene')
z=56-56//8; eq(z,49,'D z'); eq(F(2,7)*z,14,'D'); eq(F(2,7)*56,16,'D celek'); eq(F(2,7)*7,2,'D zamenil'); eq(z//7,7,'D jen del')
eq(F(5,12)*F(4,15),F(1,9),'or1'); eq(4*F(5,6),F(10,3),'or2'); eq(F(3,4)*48,36,'or3')
eq((30-5)*F(2,5),10,'red1')
# U2
eq(1-F(1,10),F(9,10),'r1'); eq(F(1,10)+F(2,3),F(23,30),'r2'); eq(F(23,30)*150,115,'r3'); eq(150-115,35,'r4')
eq(F(1,10)+F(2,3)*F(1,10),F(1,6),'k2a'); eq(F(1+2,10+3),F(3,13),'k2b'); eq(F(1,10)+F(2,3)*F(9,10),F(7,10),'k2c')
eq(150-F(7,10)*150,45,'final'); eq(F(7,10)*150,105,'done'); eq(F(2,3)*F(9,10),F(3,5),'mon')
eq(135*F(2,3),90,'alt mon'); eq(150*F(2,3),100,'otoc'); assert len({45,35,105,15,90})==5
eq((40-10)*F(1,2),15,'or u2'); eq(40-10-15,15,'or u2 zb')
eq(10-2-4,4,'red u2')
# U3
eq(720-720//4,540,'z'); eq(540*F(2,9),120,'suv'); eq(540-120,420,'domu'); eq(F(420,720),F(7,12),'cast')
eq(720*F(2,9),160,'k1 celek'); eq(540//9,60,'k1 jen'); eq(180*F(2,9),40,'k1 zam')
eq(540-160,380,'k2 celek'); eq(540-60,480,'k2 jen'); eq(F(380,720),F(19,36),'fin celek'); eq(F(120,720),F(1,6),'fin zam'); eq(1-F(2,9),F(7,9),'fin prehl')
eq(F(3,4)*F(7,9),F(7,12),'jina cesta'); eq(F(420,60)*60,420,'zkraceni 60'); assert 420%60==0 and 720%60==0
eq(500-100-100,300,'or u3'); eq(F(300,500),F(3,5),'or u3 cast'); eq((500-100)//4,100,'or kasicka')
eq(21-7-7,7,'red u3')
# U4
eq(140-20,120,'z'); eq(120*F(2,5),48,'2.den'); eq(120-48,72,'vys'); eq(120-140*F(2,5),64,'celek'); eq(120-120//5,96,'jen'); 
eq(100-20-30,50,'or u4'); eq(80*F(3,8),30,'or u4 b')
eq(36-12-6,18,'red u4')
print('L1NB matematika OK')
