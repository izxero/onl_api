select ID, NAME_THAI,OLD_ID,sum(bal) BAL, sum(pl_bal) PL_BAL
from (
     select 
       m.id, 
       m.Name_Thai, 
       m.Old_Id,
       nvl(
           (select sum(v.db - v.CR) 
           from gl_vchr v 
           where v.id = m.id 
           and v.stat != 'X'  
           and v.vchr_date between to_date('01/01/2016', 'dd/mm/yyyy') and last_day(to_date('31/01/2021', 'dd/mm/yyyy'))),  0) as bal, 
       nvl(
           (select sum(v.db - v.CR) 
           from gl_vchr v 
           where v.id = m.id 
           and v.stat != 'X'  
           and v.vchr_date between to_date('1/01/2021', 'dd/mm/yyyy') and last_day(to_date('31/01/2021', 'dd/mm/yyyy'))),  0) as pl_bal
      from gl_mst m 
      where m.head = 'D' 
      and m.stat != 'X') 
 group by ID, NAME_THAI, old_id order by OLD_ID;