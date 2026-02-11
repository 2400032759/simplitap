
-- Check team_members for the email
SELECT * FROM public.team_members WHERE email = 'kakkirenivishwas@gmail.com';

-- Check profiles for the email/user
SELECT id, email, team_id, is_premium, plan_type FROM public.profiles WHERE email = 'kakkirenivishwas@gmail.com' OR card_mail = 'kakkirenivishwas@gmail.com';
