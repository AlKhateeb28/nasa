-- Сделайте сквозную нумерацию фактических платежей по проектам на каждый год в отдельности в порядке даты платежей.
--Получите платежи, сквозной номер которых кратен 5.
--Выведите скользящее среднее размеров платежей с шагом 2 строки назад и 2 строки вперед от текущей.
--Получите сумму скользящих средних значений.
--Получите сумму проектов на каждый год.
--Выведите в результат значение года (годов) и сумму проектов, где сумма проектов меньше, чем сумма скользящих средних значений.

with payments_with_rn as (
    select pp.amount,
        pp.fact_transaction_timestamp,
        extract(year from pp.fact_transaction_timestamp) as year,
        row_number() over (
            partition by extract(year from pp.fact_transaction_timestamp)
            order by pp.fact_transaction_timestamp
            ) as rn
    from project_payment pp
    order by fact_transaction_timestamp
),
payments_with_ood as (
    select *
        from payments_with_rn
        where rn % 5=0
     ),
moving_avg_calc as (
    select *,
        avg(p.amount) over (
            partition by p.year
            order by p.rn
            rows between 2 preceding and 2 following
        ) as moving_avg
    from payments_with_ood p
),
sum_moving_avg_by_year as (
    select
    year,
    sum(moving_avg) as total_moving_avg
    from moving_avg_calc
    group by year
),
yearly_project_costs as (
    select
    extract(year from sign_date) as year,
    sum(project_cost) as total_project_cost
    from project
    group by extract(year from sign_date)
)
select
    ypc.year,
    ypc.total_project_cost,
    smay.total_moving_avg
    from yearly_project_costs ypc
    join sum_moving_avg_by_year smay on ypc.year = smay.year
where ypc.total_project_cost < smay.total_moving_avg



/*select * , avg(amount) over (
    partition by year
    order by rn
    rows between 2 preceding and 2 following
    ) as moving_avg
from payments_with_rn
where rn % 5=0*/