-- ============================================================
-- SCHEMA
-- ============================================================

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  is_adult boolean default false,
  active boolean default true,
  sort_order int default 0
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  text text not null,
  active boolean default true,
  created_by_user_id uuid references auth.users(id),
  visibility text check (visibility in ('official','private','public')) default 'official',
  moderation_status text check (moderation_status in ('approved','pending','rejected')) default 'approved',
  reports_count int default 0,
  created_at timestamptz default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  mode text check (mode in ('presencial','online','local')) not null,
  status text check (status in ('lobby','in_progress','finished')) default 'lobby',
  current_turn_player_id uuid,
  current_card_id uuid references cards(id),
  cards_to_win int default 5,
  tie_action text check (tie_action in ('discard','replay')) default 'discard',
  created_at timestamptz default now()
);

create table players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  name text not null,
  is_host boolean default false,
  cards_won int default 0,
  turn_order int,
  connected boolean default true,
  joined_at timestamptz default now()
);

alter table rooms add constraint fk_current_turn_player
  foreign key (current_turn_player_id) references players(id) deferrable initially deferred;

create table room_categories (
  room_id uuid references rooms(id) on delete cascade,
  category_id uuid references categories(id),
  primary key (room_id, category_id)
);

create table room_used_cards (
  room_id uuid references rooms(id) on delete cascade,
  card_id uuid references cards(id),
  primary key (room_id, card_id)
);

create table votes (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) on delete cascade,
  round_number int not null,
  voter_player_id uuid references players(id),
  voted_for_player_id uuid references players(id) not null,
  created_at timestamptz default now(),
  unique (room_id, round_number, voter_player_id)
);

-- Estado del juego como JSON (para Realtime sync en modo online)
create table game_state (
  room_id uuid primary key references rooms(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger game_state_updated_at
  before update on game_state
  for each row execute function update_updated_at();

-- ============================================================
-- RLS
-- ============================================================

alter table rooms enable row level security;
alter table players enable row level security;
alter table game_state enable row level security;
alter table votes enable row level security;
alter table cards enable row level security;
alter table categories enable row level security;

create policy "allow all rooms" on rooms for all using (true) with check (true);
create policy "allow all players" on players for all using (true) with check (true);
create policy "allow all game_state" on game_state for all using (true) with check (true);
create policy "allow all votes" on votes for all using (true) with check (true);
create policy "read approved cards" on cards for select using (active = true and moderation_status = 'approved');
create policy "insert cards" on cards for insert with check (true);
create policy "update own cards" on cards for update using (true);
create policy "read categories" on categories for select using (active = true);
create policy "manage categories" on categories for all using (true) with check (true);

-- ============================================================
-- SEED: CATEGORÍAS
-- ============================================================

insert into categories (name, slug, is_adult, sort_order) values
  ('Clásico',             'clasico',         false, 1),
  ('Hot / Picante',       'hot',             true,  2),
  ('¿Quién prefiere...?', 'quien-prefiere',  false, 3),
  ('Trabajo / Oficina',   'trabajo',         false, 4),
  ('Vergüenzas',          'verguenzas',      false, 5),
  ('Aventuras',           'aventuras',       false, 6),
  ('Familia',             'familia',         false, 7),
  ('Tecnología',          'tecnologia',      false, 8),
  ('Comunidad',           'comunidad',       false, 9);

-- ============================================================
-- SEED: CARTAS — CLÁSICO
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en vender un riñón por dinero?',
  '¿Quién sería el primero en llorar en una película de Disney?',
  '¿Quién sería el primero en renunciar al trabajo sin tener otro?',
  '¿Quién sería el primero en irse de viaje sin avisar a nadie?',
  '¿Quién sería el primero en hacerse un tatuaje enorme y visible?',
  '¿Quién sería el primero en mudarse solo a otro país?',
  '¿Quién sería el primero en perder todo su dinero en una apuesta?',
  '¿Quién sería el primero en adoptarse 5 gatos sin pensarlo?',
  '¿Quién sería el primero en aparecer en televisión haciendo el ridículo?',
  '¿Quién sería el primero en pedir perdón después de una pelea?',
  '¿Quién sería el primero en bloquearte sin motivo aparente?',
  '¿Quién sería el primero en olvidarse de tu cumpleaños?',
  '¿Quién sería el primero en irse antes de que termine la fiesta?',
  '¿Quién sería el primero en convertirse en vegano de la noche a la mañana?',
  '¿Quién sería el primero en gastar su sueldo completo en un capricho?'
]) from categories where slug = 'clasico';

-- ============================================================
-- SEED: CARTAS — HOT / PICANTE
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en mandar un mensaje al ex a las 3am?',
  '¿Quién sería el primero en tener una cita con alguien que conoció en internet?',
  '¿Quién sería el primero en flirtear con el/la novio/a de alguien más?',
  '¿Quién sería el primero en salir con alguien 15 años mayor?',
  '¿Quién sería el primero en tener una aventura en un baño público?',
  '¿Quién sería el primero en escribir "te extraño" cuando claramente no quiere eso?',
  '¿Quién sería el primero en tener más de dos relaciones a la vez?',
  '¿Quién sería el primero en besar a alguien del grupo?',
  '¿Quién sería el primero en mandar una foto que no debería?',
  '¿Quién sería el primero en casarse solo para no pagar impuestos?',
  '¿Quién sería el primero en enamorarse de alguien inalcanzable?',
  '¿Quién sería el primero en fingir que duerme para no tener una conversación incómoda?',
  '¿Quién sería el primero en revisar el celular de su pareja?',
  '¿Quién sería el primero en tener un crush con un/a profe o jefe/a?',
  '¿Quién sería el primero en hacer algo loco por amor?'
]) from categories where slug = 'hot';

-- ============================================================
-- SEED: CARTAS — ¿QUIÉN PREFIERE...?
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién prefiere quedarse en casa antes que salir un viernes?',
  '¿Quién prefiere comer lo mismo todos los días antes que probar algo nuevo?',
  '¿Quién prefiere mentir piadosamente antes que decir una verdad que duele?',
  '¿Quién prefiere el drama antes que el silencio incómodo?',
  '¿Quién prefiere perder dinero antes que perder una discusión?',
  '¿Quién prefiere dormir 12 horas antes que aprovechar el día?',
  '¿Quién prefiere pedir perdón antes que tener razón?',
  '¿Quién prefiere trabajar solo antes que en equipo?',
  '¿Quién prefiere pasar desapercibido antes que ser el centro de atención?',
  '¿Quién prefiere gastar en experiencias antes que en cosas materiales?',
  '¿Quién prefiere leer antes que mirar series?',
  '¿Quién prefiere tener pocos amigos muy cercanos antes que muchos conocidos?',
  '¿Quién prefiere hacerse el dormido antes que atender el teléfono?',
  '¿Quién prefiere la comida rápida antes que un restaurante elegante?',
  '¿Quién prefiere un plan espontáneo antes que algo organizado con semanas de anticipación?'
]) from categories where slug = 'quien-prefiere';

-- ============================================================
-- SEED: CARTAS — TRABAJO / OFICINA
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en salir con alguien del trabajo?',
  '¿Quién sería el primero en reportarse enfermo estando perfectamente sano?',
  '¿Quién sería el primero en hablar mal del jefe a sus espaldas?',
  '¿Quién sería el primero en llevarse algo de la oficina para su casa?',
  '¿Quién sería el primero en renunciar en medio de una reunión?',
  '¿Quién sería el primero en mandar un mensaje equivocado al grupo de trabajo?',
  '¿Quién sería el primero en dormirse en una reunión importante?',
  '¿Quién sería el primero en pedir aumento sin haber hecho nada especial?',
  '¿Quién sería el primero en tomarse el crédito por el trabajo de otro?',
  '¿Quién sería el primero en hacer home office desde la cama todo el día?',
  '¿Quién sería el primero en conectarse a una videollamada sin pantalones?',
  '¿Quién sería el primero en ignorar un correo urgente de su jefe por horas?',
  '¿Quién sería el primero en dejar el trabajo para montar un emprendimiento riesgoso?',
  '¿Quién sería el primero en hacer ghosting con un cliente difícil?',
  '¿Quién sería el primero en llegar tarde y culpar al tráfico (siendo mentira)?'
]) from categories where slug = 'trabajo';

-- ============================================================
-- SEED: CARTAS — VERGÜENZAS
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en caerse en público y fingir que fue a propósito?',
  '¿Quién sería el primero en llamar "mamá" a alguien que no es su mamá?',
  '¿Quién sería el primero en equivocarse de baño y tardar en darse cuenta?',
  '¿Quién sería el primero en mandar un audio de voz al grupo equivocado?',
  '¿Quién sería el primero en saludar a alguien que no lo saludó a él?',
  '¿Quién sería el primero en olvidarse el nombre de alguien que acaba de presentarle?',
  '¿Quién sería el primero en hacer un chiste que no le ríe nadie?',
  '¿Quién sería el primero en quedar con la tarjeta rechazada frente a todos?',
  '¿Quién sería el primero en reírse en un momento completamente inapropiado?',
  '¿Quién sería el primero en publicar algo en redes y borrarlo al minuto porque nadie le dio like?',
  '¿Quién sería el primero en confundir a gemelos y ofender a ambos?',
  '¿Quién sería el primero en llegar a una fiesta de disfraces sin disfraz?',
  '¿Quién sería el primero en tropezarse al bajar de un colectivo?',
  '¿Quién sería el primero en llegar tarde a su propia despedida?',
  '¿Quién sería el primero en mandar un meme de condolencias al grupo que no era?'
]) from categories where slug = 'verguenzas';

-- ============================================================
-- SEED: CARTAS — AVENTURAS
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en tirarse en paracaídas sin pensarlo dos veces?',
  '¿Quién sería el primero en hacer un viaje sin planificar nada?',
  '¿Quién sería el primero en subirse a una moto de un desconocido para llegar más rápido?',
  '¿Quién sería el primero en dormir en la calle por no encontrar alojamiento?',
  '¿Quién sería el primero en probar una comida rarísima de otro país sin preguntar qué es?',
  '¿Quién sería el primero en hacer una excursión peligrosa solo por el instagrameo?',
  '¿Quién sería el primero en perderse en una ciudad extranjera y no entrar en pánico?',
  '¿Quién sería el primero en hacerse amigo de alguien con quien no puede hablar por el idioma?',
  '¿Quién sería el primero en irse de mochilero por 3 meses con $500?',
  '¿Quién sería el primero en escalar una montaña sin entrenamiento previo?',
  '¿Quién sería el primero en vivir un año en un pueblo sin wifi?',
  '¿Quién sería el primero en hacer autostop?',
  '¿Quién sería el primero en mudarse a vivir en una van?',
  '¿Quién sería el primero en participar en un reality de supervivencia?',
  '¿Quién sería el primero en nadar con tiburones?'
]) from categories where slug = 'aventuras';

-- ============================================================
-- SEED: CARTAS — FAMILIA
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en presentarle a su familia a alguien que conoce hace 2 semanas?',
  '¿Quién sería el primero en armar drama en una reunión familiar?',
  '¿Quién sería el primero en contar el chisme familiar a gente de afuera?',
  '¿Quién sería el primero en meter la pata en navidad?',
  '¿Quién sería el primero en dejar de hablarle a un familiar por años?',
  '¿Quién sería el primero en pedirle plata prestada a sus padres de grande?',
  '¿Quién sería el primero en quedarse a vivir con sus padres hasta los 40?',
  '¿Quién sería el primero en tener el hijo favorito de la familia?',
  '¿Quién sería el primero en comer el postre que guardó otro familiar?',
  '¿Quién sería el primero en llegar tarde a una comida familiar importante?'
]) from categories where slug = 'familia';

-- ============================================================
-- SEED: CARTAS — TECNOLOGÍA
-- ============================================================

insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en caer en una estafa por internet?',
  '¿Quién sería el primero en pasar 12 horas viendo videos de YouTube sin parar?',
  '¿Quién sería el primero en perder el celular en una salida y no darse cuenta hasta horas después?',
  '¿Quién sería el primero en publicar algo comprometedor por accidente?',
  '¿Quién sería el primero en creer una noticia falsa y compartirla?',
  '¿Quién sería el primero en tener 10.000 notificaciones sin leer?',
  '¿Quién sería el primero en gastar dinero real en un juego móvil?',
  '¿Quién sería el primero en olvidarse todas las contraseñas y bloquear su cuenta?',
  '¿Quién sería el primero en darle like sin querer a una foto vieja del ex?',
  '¿Quién sería el primero en dejar el autocorrector arruinar un mensaje importante?',
  '¿Quién sería el primero en subir una foto y no darse cuenta que salía alguien detrás en mal momento?',
  '¿Quién sería el primero en quedarse sin batería en el momento más crítico?',
  '¿Quién sería el primero en hablar solo pensando que Siri/Alexa no estaba escuchando?',
  '¿Quién sería el primero en comprar algo caro por internet y que llegue completamente diferente?',
  '¿Quién sería el primero en pasar toda la noche discutiendo en los comentarios de una red social?'
]) from categories where slug = 'tecnologia';
