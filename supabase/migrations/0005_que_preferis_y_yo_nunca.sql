-- ============================================================
-- TIPOS DE CARTA: ¿QUÉ PREFERÍS? Y YO NUNCA
--
-- quien     → se vota a un jugador (lo de siempre)
-- preferis  → cada uno elige A o B; la minoría se lleva la carta
-- yo_nunca  → cada uno dice "yo sí" o "yo nunca"; la minoría se lleva la carta
--
-- La vieja categoría "¿Quién prefiere...?" pasa a ser "¿Qué preferís?" de verdad.
-- ============================================================

alter table cards add column if not exists type text not null default 'quien';
alter table cards add column if not exists option_a text;
alter table cards add column if not exists option_b text;

alter table cards add constraint cards_type_check
  check (type in ('quien', 'preferis', 'yo_nunca'));
alter table cards add constraint cards_preferis_opciones
  check (type <> 'preferis' or (option_a is not null and option_b is not null));

-- ------------------------------------------------------------
-- "¿Quién prefiere...?" → "¿Qué preferís?"
-- Se borran las cartas oficiales del mazo; si alguien había creado otras
-- en esa categoría, pasan a Clásico (siguen siendo de votar a un jugador).
-- ------------------------------------------------------------

create temp table cartas_retiradas (text text primary key);

insert into cartas_retiradas (text) values
  ('¿Quién preferiría cancelar un plan con amigos antes que cancelar una siesta?'),
  ('¿Quién preferiría comer algo vencido antes que tirar comida?'),
  ('¿Quién preferiría contar un secreto de {jugador} antes que uno propio?'),
  ('¿Quién preferiría estar un mes sin mate antes que una semana sin WhatsApp?'),
  ('¿Quién preferiría ganar Gran Hermano antes que recibirse?'),
  ('¿Quién preferiría inventar una respuesta antes que admitir que no sabe algo?'),
  ('¿Quién preferiría ir solo a un casamiento antes que llevar a alguien que no le gusta?'),
  ('¿Quién preferiría mudarse de país antes que cruzarse a su ex en el súper?'),
  ('¿Quién preferiría no comer nunca más asado antes que dormir una noche en un camping?'),
  ('¿Quién preferiría no enterarse nunca de una infidelidad antes que saber la verdad?'),
  ('¿Quién preferiría pagar de más antes que pedir que dividan la cuenta?'),
  ('¿Quién preferiría perder un vuelo antes que llegar dos horas antes al aeropuerto?'),
  ('¿Quién preferiría que lo dejen en visto antes que recibir un audio de cuatro minutos?'),
  ('¿Quién preferiría que lo odien antes que pasar desapercibido?'),
  ('¿Quién preferiría que su mamá lea sus chats antes que su historial de búsqueda?'),
  ('¿Quién preferiría quedar encerrado en un ascensor con su ex antes que con su jefe?'),
  ('¿Quién preferiría revisarle el celular a su pareja antes que preguntarle de frente?'),
  ('¿Quién preferiría ser famoso por algo vergonzoso antes que no ser famoso nunca?'),
  ('¿Quién preferiría ser rico y odiado antes que pobre y querido?'),
  ('¿Quién preferiría tener razón antes que ser feliz?'),
  ('¿Quién preferiría trabajar gratis de lo que ama antes que cobrar bien en algo que odia?'),
  ('¿Quién prefiere el drama antes que el silencio incómodo?'),
  ('¿Quién prefiere hacerse el dormido antes que atender el teléfono?'),
  ('¿Quién prefiere mentir piadosamente antes que decir una verdad que duele?'),
  ('¿Quién prefiere perder dinero antes que perder una discusión?');

delete from cards c
using cartas_retiradas r
where c.text = r.text
  and c.visibility = 'official'
  and not exists (select 1 from room_used_cards u where u.card_id = c.id)
  and not exists (select 1 from rooms ro where ro.current_card_id = c.id);

update cards c set active = false
from cartas_retiradas r
where c.text = r.text and c.visibility = 'official';

drop table cartas_retiradas;

update cards set category_id = (select id from categories where slug = 'clasico')
where category_id = (select id from categories where slug = 'quien-prefiere')
  and type = 'quien'
  and active;

update categories set name = '¿Qué preferís?', slug = 'que-preferis' where slug = 'quien-prefiere';

insert into categories (name, slug, is_adult, sort_order) values
  ('¿Qué preferís?',       'que-preferis',     false, 3),
  ('¿Qué preferís? (hot)', 'que-preferis-hot', true,  4),
  ('Yo nunca',             'yo-nunca',         false, 5),
  ('Yo nunca (hot)',       'yo-nunca-hot',     true,  6)
on conflict (slug) do nothing;

update categories c set sort_order = v.ord
from (values
  ('clasico', 1), ('hot', 2), ('que-preferis', 3), ('que-preferis-hot', 4),
  ('yo-nunca', 5), ('yo-nunca-hot', 6), ('trabajo', 7), ('verguenzas', 8),
  ('aventuras', 9), ('familia', 10), ('tecnologia', 11), ('fiesta', 12), ('amistad', 13)
) as v(slug, ord)
where c.slug = v.slug;

-- ------------------------------------------------------------
-- ¿QUÉ PREFERÍS?
-- ------------------------------------------------------------

insert into cards (category_id, type, text, option_a, option_b)
select c.id, 'preferis', v.text, v.option_a, v.option_b
from categories c, (values
  ('¿Qué preferís?', 'Saber todo lo que piensan de vos', 'Que nadie sepa nunca lo que pensás vos'),
  ('¿Qué preferís?', 'Que tus viejos lean todos tus chats', 'Que tu ex lea todos tus chats'),
  ('¿Qué preferís?', 'Que se filtren tus búsquedas de Google', 'Que se filtren tus audios de WhatsApp'),
  ('¿Qué preferís?', 'Un millón de dólares hoy', 'Diez mil dólares por mes toda la vida'),
  ('Si pudieras saberlo, ¿qué preferís?', 'Saber cuándo te vas a morir', 'Saber cómo te vas a morir'),
  ('¿Qué preferís?', 'Quedarte en el país con un buen sueldo', 'Irte afuera a empezar de cero'),
  ('¿Qué preferís?', 'Que te dejen por WhatsApp', 'Que te dejen en persona delante de tus amigos'),
  ('¿Qué preferís?', 'Que tu pareja te engañe y no enterarte nunca', 'Enterarte, aunque haya sido solo un beso'),
  ('¿Qué preferís?', 'Ser famoso y odiado', 'Ser anónimo y querido'),
  ('¿Qué preferís?', 'Un trabajo que amás y ganar poco', 'Un trabajo que odiás y ganar el triple'),
  ('¿Qué preferís?', 'Ser el más inteligente de esta ronda', 'Ser el más lindo de esta ronda'),
  ('¿Qué preferís?', 'Enterarte de todas las mentiras que te dijeron', 'No enterarte nunca de ninguna'),
  ('¿Qué preferís?', 'Repetir tu peor año', 'Borrar tu mejor año de la memoria'),
  ('¿Qué preferís?', 'Una pareja muy celosa', 'Una pareja a la que le da todo igual'),
  ('¿Qué preferís?', 'Vivir 100 años con lo justo', 'Vivir 60 a todo trapo'),
  ('¿Qué preferís?', 'Ganar la lotería y no poder contárselo a nadie', 'Que la gane tu mejor amigo y te dé el 10%'),
  ('¿Qué preferís?', 'Volver con tu ex', 'Estar cinco años sin pareja'),
  ('¿Qué preferís?', 'Que tu mejor amigo salga con tu ex', 'Que tu ex salga con tu hermano'),
  ('¿Qué preferís?', 'Saber qué pensó tu ex cuando cortaron', 'Saber qué piensa hoy de vos'),
  ('¿Qué preferís?', 'Vivir un año en lo de tus suegros', 'Que tus suegros vivan un año en tu casa'),
  ('¿Qué preferís?', 'Irte de vacaciones con tu familia', 'Irte de vacaciones con tu ex'),
  ('¿Qué preferís?', 'Trabajar con tu mejor amigo', 'Trabajar con tu pareja'),
  ('¿Qué preferís?', 'Que {jugador} te diga en la cara todo lo que piensa de vos', 'No saberlo nunca'),
  ('¿Qué preferís?', 'Irte un mes de viaje con {jugador}', 'Que {jugador} viva un mes en tu casa'),
  ('¿Qué preferís?', 'Que te digan la verdad aunque duela', 'Que te mientan para no lastimarte'),
  ('¿Qué preferís?', 'Ganar el doble y no tener vacaciones nunca', 'Ganar lo mismo y tener tres meses libres por año'),
  ('Para siempre, ¿qué preferís?', 'Dejar el alcohol', 'Dejar la carne'),
  ('¿Qué preferís?', 'Ser siempre el que organiza todo', 'Que nunca te inviten a nada'),
  ('¿Qué preferís?', 'Leerle la mente a tu pareja por un día', 'Que tu pareja te la lea a vos'),
  ('¿Qué preferís?', 'Perder a tu mejor amigo', 'Perder a tu pareja'),
  ('¿Qué preferís?', 'Que tu mamá te stalkee en todas tus redes', 'Que te stalkee tu jefe'),
  ('¿Qué preferís?', 'Ser buena persona y que nadie lo sepa', 'Que todos te crean buena persona sin serlo'),
  ('¿Qué preferís?', 'Conocer a tu alma gemela a los 50', 'Casarte a los 25 con alguien que va más o menos'),
  ('¿Qué preferís?', 'Que tus amigos elijan a tu pareja', 'Que tu familia elija a tu pareja'),
  ('¿Qué preferís?', 'Decirle a tu jefe todo lo que pensás y quedarte sin laburo', 'Callarte cinco años más'),
  ('¿Qué preferís?', 'Ser rico y que todos piensen que sos pobre', 'Ser pobre y que todos piensen que sos rico'),
  ('¿Qué preferís?', 'Quedar encerrado en un ascensor con tu ex', 'Quedar encerrado con tu jefe'),
  ('¿Qué preferís?', 'Saber lo que {jugador} dice de vos cuando no estás', 'Que {jugador} sepa lo que decís vos')
) as v(text, option_a, option_b)
where c.slug = 'que-preferis';

-- ¿QUÉ PREFERÍS? (HOT)

insert into cards (category_id, type, text, option_a, option_b)
select c.id, 'preferis', v.text, v.option_a, v.option_b
from categories c, (values
  ('¿Qué preferís?', 'Sexo increíble una vez al año', 'Sexo del montón todos los días'),
  ('¿Qué preferís?', 'Que todos sepan con cuántas personas estuviste', 'Que todos sepan cuánto ganás'),
  ('¿Qué preferís?', 'Que tu pareja vea tu historial de búsqueda', 'Que tu pareja vea tu galería de fotos'),
  ('¿Qué preferís?', 'Chaparte a {jugador} delante de todos', 'Contar tu peor chape con lujo de detalles'),
  ('¿Qué preferís?', 'Una noche con tu crush famoso', 'Un año de relación con tu crush de la vida real'),
  ('¿Qué preferís?', 'Una pareja que te encanta pero besa mal', 'Una que no te mueve un pelo pero besa increíble'),
  ('¿Qué preferís?', 'Una relación abierta', 'Una relación cerrada pero con muchos celos'),
  ('¿Qué preferís?', 'Que tu vieja encuentre tu cajón secreto', 'Que tu jefe lea tus chats hot'),
  ('¿Qué preferís?', 'Mandar un nude al grupo de la familia', 'Mandarlo al grupo del laburo'),
  ('¿Qué preferís?', 'Que te encuentren en pleno acto tus viejos', 'Que te encuentren tus suegros'),
  ('¿Qué preferís?', 'Tener un amante', 'Ser el amante'),
  ('¿Qué preferís?', 'Salir con alguien 15 años mayor', 'Salir con alguien 15 años menor'),
  ('¿Qué preferís?', 'Volver con tu ex por una noche', 'Seis meses sin sexo'),
  ('¿Qué preferís?', 'Ser lindísimo pero un desastre en la cama', 'Del montón pero increíble en la cama'),
  ('¿Qué preferís?', 'Saber a quién de esta ronda elegiría tu pareja', 'No saberlo nunca'),
  ('¿Qué preferís?', 'Encontrar a tu pareja en Tinder', 'Que tu pareja te encuentre a vos'),
  ('¿Qué preferís?', 'Que se filtre un video tuyo bailando en bolas', 'Que se filtren tus audios hot'),
  ('¿Qué preferís?', 'Hacerlo en la playa', 'Hacerlo en un avión'),
  ('¿Qué preferís?', 'Que tu pareja tenga muchísima más experiencia que vos', 'Que tenga muchísima menos'),
  ('¿Qué preferís?', 'Un trío con dos desconocidos', 'Un trío con dos amigos'),
  ('¿Qué preferís?', 'Que tu ex cuente cómo sos en la cama', 'Que lo cuente tu pareja actual'),
  ('¿Qué preferís?', 'Una cita a ciegas elegida por {jugador}', 'Una cita a ciegas elegida por tu mamá')
) as v(text, option_a, option_b)
where c.slug = 'que-preferis-hot';

-- ------------------------------------------------------------
-- YO NUNCA
-- ------------------------------------------------------------

insert into cards (category_id, type, text) select id, 'yo_nunca', unnest(array[
  'Yo nunca le mentí a alguien de esta ronda para no salir.',
  'Yo nunca hablé mal de alguien de esta ronda a sus espaldas.',
  'Yo nunca stalkeé a la pareja de un amigo.',
  'Yo nunca me hice el enfermo para faltar al trabajo o a la facultad.',
  'Yo nunca leí los mensajes de otro sin permiso.',
  'Yo nunca me fui de un bar o un restaurante sin pagar.',
  'Yo nunca reenvié la captura de un chat privado.',
  'Yo nunca me copié en un examen importante.',
  'Yo nunca regalé algo que me habían regalado.',
  'Yo nunca me olvidé el cumpleaños de alguien de esta ronda.',
  'Yo nunca dije "te quiero" sin sentirlo.',
  'Yo nunca lloré por alguien que no lo merecía.',
  'Yo nunca desbloqueé a alguien solo para ver qué estaba haciendo.',
  'Yo nunca me quedé con un vuelto que no era mío.',
  'Yo nunca mentí en mi CV.',
  'Yo nunca escuché una conversación ajena a escondidas.',
  'Yo nunca adelanté una serie que había prometido ver con otra persona.',
  'Yo nunca me hice pasar por otra persona en internet.',
  'Yo nunca vomité en un auto ajeno.',
  'Yo nunca me desperté sin saber dónde estaba.',
  'Yo nunca me colé en un recital o en una fiesta.',
  'Yo nunca le eché la culpa a otro de algo que hice yo.',
  'Yo nunca estuve enojado con alguien de esta ronda sin decírselo.',
  'Yo nunca fingí no haber visto un mensaje.',
  'Yo nunca salí con dos personas a la vez.',
  'Yo nunca tuve un crush con alguien de esta ronda.',
  'Yo nunca dejé en visto a alguien más de una semana a propósito.',
  'Yo nunca le saqué plata de la billetera a mis viejos.',
  'Yo nunca me agarré a piñas.',
  'Yo nunca conté un secreto que me pidieron guardar.',
  'Yo nunca me peleé por política en un asado.',
  'Yo nunca usé el celular de otro para mandar un mensaje en joda.',
  'Yo nunca me hice el que no conocía a alguien para no saludarlo.',
  'Yo nunca lloré en el trabajo.',
  'Yo nunca le dije el nombre equivocado a alguien con quien estaba saliendo.',
  'Yo nunca le revisé el celular a {jugador}.',
  'Yo nunca pensé que {jugador} era insoportable cuando lo conocí.',
  'Yo nunca me inventé una pareja para sacarme a alguien de encima.',
  'Yo nunca me fui de una juntada sin saludar para no dar explicaciones.',
  'Yo nunca me tatué algo de lo que me arrepiento.',
  'Yo nunca le escribí a un ex estando en pedo.'
]) from categories where slug = 'yo-nunca';

-- YO NUNCA (HOT)

insert into cards (category_id, type, text) select id, 'yo_nunca', unnest(array[
  'Yo nunca me chapé a alguien de esta ronda.',
  'Yo nunca tuve sexo en un lugar público.',
  'Yo nunca mandé un nude.',
  'Yo nunca me acosté con alguien en la primera cita.',
  'Yo nunca fingí un orgasmo.',
  'Yo nunca hice un trío.',
  'Yo nunca me acosté con un ex después de cortar.',
  'Yo nunca estuve con alguien que estaba en pareja.',
  'Yo nunca fui infiel.',
  'Yo nunca usé una app de citas estando en pareja.',
  'Yo nunca me desperté al lado de alguien sin acordarme de su nombre.',
  'Yo nunca tuve sexo en la casa de mis viejos con ellos adentro.',
  'Yo nunca tuve un amigovio.',
  'Yo nunca me chapé a dos personas en la misma noche.',
  'Yo nunca estuve con alguien del trabajo.',
  'Yo nunca tuve sexo en un auto.',
  'Yo nunca hice sexting con alguien que no conocía en persona.',
  'Yo nunca estuve con el ex de un amigo.',
  'Yo nunca tuve un sueño hot con alguien de esta ronda.',
  'Yo nunca me compré un juguete sexual.',
  'Yo nunca me tuve que vestir a las apuradas porque llegaba alguien.',
  'Yo nunca tuve una relación a escondidas.',
  'Yo nunca mentí sobre con cuántas personas estuve.',
  'Yo nunca hice un striptease.',
  'Yo nunca le escribí a un ex estando en pareja.',
  'Yo nunca tuve sexo en la playa o en una pileta.',
  'Yo nunca me chapé a {jugador}.'
]) from categories where slug = 'yo-nunca-hot';
