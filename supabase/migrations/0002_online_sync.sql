-- ============================================================
-- REALTIME: el modo online escucha cambios en estas tablas.
-- Sin agregarlas a la publicación, Supabase no emite eventos y
-- los demás jugadores nunca ven la partida avanzar.
-- ============================================================

do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['rooms', 'players', 'game_state'] loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  end if;
end $$;

-- ============================================================
-- VOTO ATÓMICO
-- Antes cada jugador reescribía el game_state entero con su voto:
-- si dos votaban a la vez, el último pisaba al otro y la ronda
-- quedaba trabada esperando un voto que ya se había perdido.
-- ============================================================

create or replace function cast_vote(p_room_id uuid, p_voter_id text, p_voted_for_id text)
returns void
language sql
as $$
  update game_state
     set state = jsonb_set(
       state,
       '{votes}',
       coalesce(state->'votes', '{}'::jsonb) || jsonb_build_object(p_voter_id, p_voted_for_id)
     )
   where room_id = p_room_id
     and state->>'phase' = 'voting';
$$;

grant execute on function cast_vote(uuid, text, text) to anon, authenticated;
