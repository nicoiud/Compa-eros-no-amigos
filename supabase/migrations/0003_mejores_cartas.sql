-- ============================================================
-- MAZO MEJORADO
--
-- 1. Corrige redacción de cartas del seed original (se actualizan
--    en el lugar: mismos ids, solo si el texto sigue siendo el
--    original, así no se pisan ediciones hechas desde el admin).
-- 2. Mueve a su categoría las cartas que estaban mal ubicadas.
-- 3. Desactiva las que no funcionaban (quedan visibles en el admin).
-- 4. Agrega dos categorías nuevas (Fiesta / Previa, Amistad) y 215 cartas nuevas.
--
-- Algunas ideas de actividades (bungee jumping, karaoke, cita a ciegas,
-- comer un bicho, toro mecánico, etc.) están adaptadas de la lista
-- "never have I ever" de party-game-sentences (MIT, © 2023 brunolepis,
-- https://github.com/itsbrunodev/party-game-sentences). Ver CREDITS.md.
-- ============================================================

-- ------------------------------------------------------------
-- 1. REDACCIÓN
-- ------------------------------------------------------------

update cards c set text = v.new_text
from (values
  ('¿Quién sería el primero en adoptarse 5 gatos sin pensarlo?',
   '¿Quién sería el primero en adoptar cinco gatos sin pensarlo?'),
  ('¿Quién sería el primero en bloquearte sin motivo aparente?',
   '¿Quién sería el primero en bloquear a alguien sin motivo aparente?'),
  ('¿Quién sería el primero en olvidarse de tu cumpleaños?',
   '¿Quién sería el primero en olvidarse del cumpleaños de su mejor amigo?'),
  ('¿Quién sería el primero en flirtear con el/la novio/a de alguien más?',
   '¿Quién sería el primero en coquetear con la pareja de otra persona?'),
  ('¿Quién sería el primero en escribir "te extraño" cuando claramente no quiere eso?',
   '¿Quién sería el primero en mandarle un "te extraño" a alguien que lo dejó en visto?'),
  ('¿Quién sería el primero en hacer ghosting con un cliente difícil?',
   '¿Quién sería el primero en hacerle ghosting a un cliente difícil?'),
  ('¿Quién sería el primero en llegar tarde y culpar al tráfico (siendo mentira)?',
   '¿Quién sería el primero en llegar tarde, culpar al tráfico y en realidad haberse quedado dormido?'),
  ('¿Quién sería el primero en llamar "mamá" a alguien que no es su mamá?',
   '¿Quién sería el primero en decirle "mamá" a una profesora sin querer?'),
  ('¿Quién sería el primero en saludar a alguien que no lo saludó a él?',
   '¿Quién sería el primero en devolverle el saludo a alguien que en realidad saludaba a otra persona?'),
  ('¿Quién sería el primero en hacer un chiste que no le ríe nadie?',
   '¿Quién sería el primero en hacer un chiste que no le causa gracia a nadie?'),
  ('¿Quién sería el primero en quedar con la tarjeta rechazada frente a todos?',
   '¿A quién le rechazarían primero la tarjeta delante de todos?'),
  ('¿Quién sería el primero en llegar a una fiesta de disfraces sin disfraz?',
   '¿Quién sería el primero en ir disfrazado a una fiesta que no era de disfraces?'),
  ('¿Quién sería el primero en mandar un meme de condolencias al grupo que no era?',
   '¿Quién sería el primero en mandar un sticker de risa en un grupo donde estaban dando el pésame?'),
  ('¿Quién sería el primero en hacer una excursión peligrosa solo por el instagrameo?',
   '¿Quién sería el primero en hacer una excursión peligrosa solo por la foto para Instagram?'),
  ('¿Quién sería el primero en irse de mochilero por 3 meses con $500?',
   '¿Quién sería el primero en irse de mochilero tres meses con 500 dólares?'),
  ('¿Quién sería el primero en meter la pata en navidad?',
   '¿Quién sería el primero en meter la pata en la cena de Navidad?'),
  ('¿Quién sería el primero en tener el hijo favorito de la familia?',
   '¿Quién sería el primero en tener hijos?'),
  ('¿Quién sería el primero en comer el postre que guardó otro familiar?',
   '¿Quién sería el primero en comerse el postre que otro había guardado en la heladera?'),
  ('¿Quién sería el primero en dejar el autocorrector arruinar un mensaje importante?',
   '¿Quién sería el primero en dejar que el autocorrector le arruine un mensaje importante?'),
  ('¿Quién sería el primero en subir una foto y no darse cuenta que salía alguien detrás en mal momento?',
   '¿Quién sería el primero en subir una foto sin darse cuenta de lo que se veía en el fondo?'),
  ('¿Quién sería el primero en hablar solo pensando que Siri/Alexa no estaba escuchando?',
   '¿Quién sería el primero en pelearse a los gritos con Siri o Alexa?')
) as v(old_text, new_text)
where c.text = v.old_text and c.visibility = 'official';

-- ------------------------------------------------------------
-- 2. CARTAS MAL UBICADAS (no eran picantes)
-- ------------------------------------------------------------

update cards set category_id = (select id from categories where slug = 'clasico')
where visibility = 'official'
  and text = '¿Quién sería el primero en fingir que duerme para no tener una conversación incómoda?';

-- ------------------------------------------------------------
-- 3. CARTAS QUE SE RETIRAN
-- ------------------------------------------------------------

update cards set active = false
where visibility = 'official'
  and text in (
    '¿Quién sería el primero en casarse solo para no pagar impuestos?',
    '¿Quién sería el primero en confundir a gemelos y ofender a ambos?'
  );

-- ------------------------------------------------------------
-- 4. CATEGORÍAS NUEVAS (Comunidad queda última)
-- ------------------------------------------------------------

insert into categories (name, slug, is_adult, sort_order) values
  ('Fiesta / Previa', 'fiesta',  false, 9),
  ('Amistad',         'amistad', false, 10)
on conflict (slug) do nothing;

update categories set sort_order = 99 where slug = 'comunidad';

-- ------------------------------------------------------------
-- 5. CARTAS NUEVAS
-- ------------------------------------------------------------

-- CLÁSICO
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en hacerse famoso?',
  '¿Quién sería el primero en hacerse millonario?',
  '¿Quién sería el primero en perder el billete ganador de la lotería?',
  '¿Quién sería el primero en terminar en una comisaría por una pavada?',
  '¿Quién sería el primero en casarse en Las Vegas con alguien que conoció esa noche?',
  '¿Quién sería el primero en raparse por una apuesta?',
  '¿Quién sería el primero en teñirse el pelo de un color flúor?',
  '¿Quién sería el primero en comerse un bicho si le pagan?',
  '¿Quién sería el primero en agarrar el micrófono en un karaoke sin que nadie se lo pida?',
  '¿Quién sería el primero en abrir su propio restaurante?',
  '¿Quién sería el primero en escribir un libro?',
  '¿Quién sería el primero en dejar todo para irse a vivir a la playa?',
  '¿Quién sería el primero en hacerse influencer?',
  '¿Quién sería el primero en llorar en un casamiento ajeno?',
  '¿Quién sería el primero en quedarse dormido en el cine?',
  '¿Quién sería el primero en tener una mascota exótica?',
  '¿Quién sería el primero en comprarse algo carísimo y devolverlo al día siguiente?',
  '¿Quién sería el primero en contar un secreto que le pidieron guardar?',
  '¿Quién sería el primero en conocer a su ídolo y quedarse mudo?',
  '¿Quién sería el primero en tirarse a la pileta con ropa?',
  '¿Quién sería el primero en enojarse en serio jugando a un juego de mesa?',
  '¿Quién sería el primero en comerse la última porción sin preguntar?',
  '¿Quién sería el primero en quedarse sin nafta en la ruta?',
  '¿Quién sería el primero en quedarse afuera de su casa con las llaves adentro?',
  '¿Quién sería el primero en sobrevivir a un apocalipsis zombie?'
]) from categories where slug = 'clasico';

-- HOT / PICANTE
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en volver con su ex?',
  '¿Quién sería el primero en aceptar una cita a ciegas?',
  '¿Quién sería el primero en tener un amor de verano?',
  '¿Quién sería el primero en chaparse a un desconocido en el boliche?',
  '¿Quién sería el primero en mandar un audio subido de tono y arrepentirse al segundo?',
  '¿Quién sería el primero en tener un crush secreto con alguien de esta ronda?',
  '¿Quién sería el primero en hacerse una cuenta falsa para stalkear a su ex?',
  '¿Quién sería el primero en dar el primer paso?',
  '¿Quién sería el primero en tener una cita con alguien que no se parece en nada a sus fotos?',
  '¿Quién sería el primero en terminar la primera cita en su casa?',
  '¿A quién se le filtraría primero un chat picante?',
  '¿Quién sería el primero en escribirle una carta de amor a alguien?',
  '¿Quién sería el primero en casarse con alguien que conoce hace menos de un año?',
  '¿Quién sería el primero en tener un amigovio?',
  '¿Quién sería el primero en confesarle a alguien que le gusta en medio de una fiesta?',
  '¿Quién sería el primero en tener una app de citas instalada estando en pareja?',
  '¿Quién sería el primero en reconciliarse con alguien a las 4 de la mañana?',
  '¿Quién sería el primero en stalkear a la nueva pareja de su ex?',
  '¿Quién sería el primero en mentir sobre su edad en una app de citas?',
  '¿A quién agarrarían primero infraganti?',
  '¿Quién sería el primero en tener una relación a distancia?',
  '¿Quién sería el primero en cortar una relación por mensaje?',
  '¿Quién sería el primero en animarse a un trío?',
  '¿Quién sería el primero en quedarse a dormir en lo de alguien que conoció esa noche?',
  '¿Quién sería el primero en enamorarse en un viaje?'
]) from categories where slug = 'hot';

-- ¿QUIÉN PREFIERE...?
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién prefiere viajar solo antes que con amigos?',
  '¿Quién prefiere mandar audios antes que escribir?',
  '¿Quién prefiere volver a ver una serie antes que empezar una nueva?',
  '¿Quién prefiere levantarse temprano antes que quedarse despierto hasta tarde?',
  '¿Quién prefiere el frío antes que el calor?',
  '¿Quién prefiere la montaña antes que la playa?',
  '¿Quién prefiere cocinar antes que pedir delivery?',
  '¿Quién prefiere un gato antes que un perro?',
  '¿Quién prefiere saber la verdad aunque duela antes que vivir engañado?',
  '¿Quién prefiere ir al cine solo antes que no ir?',
  '¿Quién prefiere salir a bailar antes que una juntada tranqui?',
  '¿Quién prefiere el mate amargo antes que dulce?',
  '¿Quién prefiere caminar veinte cuadras antes que tomarse un taxi?',
  '¿Quién prefiere escuchar la misma playlist de siempre antes que descubrir música nueva?',
  '¿Quién prefiere llegar una hora antes que cinco minutos tarde?',
  '¿Quién prefiere vivir en el campo antes que en la ciudad?',
  '¿Quién prefiere tener mucha plata y poco tiempo antes que mucho tiempo y poca plata?',
  '¿Quién prefiere quedarse callado antes que decir lo que piensa?',
  '¿Quién prefiere un asado con amigos antes que una cena elegante?',
  '¿Quién prefiere que le spoileen una serie antes que esperar al final?'
]) from categories where slug = 'quien-prefiere';

-- TRABAJO / OFICINA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en llorar en el baño de la oficina?',
  '¿Quién sería el primero en apretar "responder a todos" en un mail que no debía?',
  '¿Quién sería el primero en quedarse hasta tarde solo para impresionar al jefe?',
  '¿Quién sería el primero en organizar el amigo invisible de la oficina?',
  '¿Quién sería el primero en hacerse amigo del jefe?',
  '¿Quién sería el primero en dejar el micrófono abierto en una reunión?',
  '¿Quién sería el primero en inventar un velorio para faltar?',
  '¿Quién sería el primero en llevar tupper todos los días?',
  '¿Quién sería el primero en terminar casado con alguien del trabajo?',
  '¿Quién sería el primero en pedirse vacaciones el primer mes?',
  '¿Quién sería el primero en clavar el visto en el grupo del laburo?',
  '¿Quién sería el primero en comprar facturas para todos para caer bien?',
  '¿Quién sería el primero en tener el LinkedIn más activo que el Instagram?',
  '¿Quién sería el primero en renunciar con un mail de una sola línea?',
  '¿Quién sería el primero en escribirle mal el nombre a un cliente importante?',
  '¿Quién sería el primero en contestar mails desde la playa en plenas vacaciones?',
  '¿Quién sería el primero en jugar a algo en la compu en horario laboral?',
  '¿Quién sería el primero en armar un chusmerío en la oficina?',
  '¿Quién sería el primero en hacer stand-up en la fiesta de fin de año de la empresa?',
  '¿Quién sería el primero en pasarse de copas en la fiesta de fin de año de la empresa?'
]) from categories where slug = 'trabajo';

-- VERGÜENZAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en cantar a los gritos con auriculares sin darse cuenta?',
  '¿Quién sería el primero en ir a dar un beso cuando el otro le daba la mano?',
  '¿Quién sería el primero en contestar "vos también" cuando el mozo le dice "que lo disfrute"?',
  '¿Quién sería el primero en empujar una puerta que decía "tirar"?',
  '¿Quién sería el primero en quedarse encerrado en un baño?',
  '¿Quién sería el primero en mandarle una captura del chat a la persona de la que estaba hablando?',
  '¿Quién sería el primero en salir a la calle con la etiqueta de la ropa puesta?',
  '¿Quién sería el primero en quedarse dormido y babearse en el colectivo?',
  '¿Quién sería el primero en decir el nombre de su ex en una cita?',
  '¿Quién sería el primero en pasar toda la noche con algo entre los dientes?',
  '¿Quién sería el primero en llorar viendo una publicidad?',
  '¿A quién se le rompería primero el pantalón en público?',
  '¿Quién sería el primero en hacerse viral por un video vergonzoso?',
  '¿Quién sería el primero en quedarse en blanco en una exposición oral?',
  '¿Quién sería el primero en mandar sin querer un audio de cinco minutos?',
  '¿Quién sería el primero en prender la cámara sin querer en una videollamada?',
  '¿Quién sería el primero en abrazar a un desconocido pensando que era un amigo?',
  '¿Quién sería el primero en caerse en la pista de baile?',
  '¿Quién sería el primero en reírse de un chiste que no entendió?',
  '¿A quién agarrarían primero hablando solo por la calle?'
]) from categories where slug = 'verguenzas';

-- AVENTURAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en hacer bungee jumping?',
  '¿Quién sería el primero en meterse al agua helada en pleno invierno?',
  '¿Quién sería el primero en subirse a un toro mecánico?',
  '¿Quién sería el primero en dormir bajo las estrellas en el medio de la nada?',
  '¿Quién sería el primero en recorrer Sudamérica en bici?',
  '¿Quién sería el primero en comerse un escorpión?',
  '¿Quién sería el primero en anotarse en una maratón sin haber entrenado?',
  '¿Quién sería el primero en salir corriendo de un tour de fantasmas?',
  '¿Quién sería el primero en subirse tres veces seguidas a la montaña rusa más grande?',
  '¿Quién sería el primero en irse a vivir a una isla?',
  '¿Quién sería el primero en aprender a surfear?',
  '¿Quién sería el primero en volar en globo aerostático?',
  '¿Quién sería el primero en irse de safari?',
  '¿Quién sería el primero en viajar a otro país solo para ir a un festival?',
  '¿Quién sería el primero en cruzar la cordillera en auto?',
  '¿Quién sería el primero en irse de campamento y volverse la primera noche?',
  '¿Quién sería el primero en tirarse de un acantilado al agua?',
  '¿Quién sería el primero en perder un vuelo?',
  '¿Quién sería el primero en quedarse varado en un aeropuerto y hacerse amigo de todos?',
  '¿Quién sería el primero en salir de noche en un país que no conoce y volver con amigos nuevos?'
]) from categories where slug = 'aventuras';

-- FAMILIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en casarse?',
  '¿Quién sería el primero en mudarse a la casa de los suegros?',
  '¿Quién sería el primero en pelearse por una herencia?',
  '¿Quién sería el primero en olvidarse del cumpleaños de su mamá?',
  '¿Quién sería el primero en ponerle un nombre rarísimo a su hijo?',
  '¿Quién sería el primero en discutir de política en la mesa familiar?',
  '¿Quién sería el primero en tener silenciado el grupo de WhatsApp de la familia?',
  '¿Quién sería el primero en llevar a una cita a un casamiento familiar?',
  '¿Quién sería el primero en organizar todas las reuniones familiares?',
  '¿Quién sería el primero en llorar en el casamiento de un primo?',
  '¿Quién sería el primero en contarle a su mamá algo que no debía?',
  '¿Quién sería el primero en volver a vivir con sus padres?',
  '¿Quién sería el primero en tener más de tres hijos?',
  '¿Quién sería el primero en llevarse los tuppers de comida de la abuela?',
  '¿Quién sería el primero en convertirse en el tío o la tía copada de la familia?',
  '¿Quién sería el primero en mentirle a sus padres sobre dónde está?',
  '¿Quién sería el primero en irse a dormir antes del brindis de Año Nuevo?',
  '¿Quién sería el primero en pelearse con un hermano por el control remoto siendo adulto?',
  '¿Quién sería el primero en tener el auto más viejo de la familia y negarse a cambiarlo?',
  '¿Quién sería el nieto preferido de la abuela?'
]) from categories where slug = 'familia';

-- TECNOLOGÍA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en jugar 24 horas seguidas a un videojuego?',
  '¿Quién sería el primero en comprarse el último celular el día que sale?',
  '¿Quién sería el primero en usar el celular con la pantalla rota durante años?',
  '¿Quién sería el primero en quedarse toda la noche scrolleando TikTok?',
  '¿Quién sería el primero en enamorarse de alguien por chat sin haberlo visto nunca?',
  '¿Quién sería el primero en llegar al millón de seguidores?',
  '¿Quién sería el primero en borrar todas sus redes sociales?',
  '¿Quién sería el primero en aguantar un mes sin celular?',
  '¿Quién sería el primero en invertir en cripto y perder todo?',
  '¿Quién sería el primero en stalkear a alguien hasta las fotos de 2015?',
  '¿Quién sería el primero en comprar algo en cuotas a las 3 de la mañana?',
  '¿Quién sería el primero en usar la misma contraseña para todo?',
  '¿Quién sería el primero en pedirle a una IA que le escriba un mensaje de amor?',
  '¿Quién sería el primero en abrirse un canal de YouTube?',
  '¿Quién sería el primero en tener más de 50 pestañas abiertas?',
  '¿Quién sería el primero en ver una temporada entera en un día?',
  '¿Quién sería el primero en olvidarse el celular en un taxi?',
  '¿Quién sería el primero en pelearse con un amigo por una discusión en un grupo de WhatsApp?',
  '¿Quién sería el primero en dejar el celular sin batería a propósito para que no lo molesten?',
  '¿Quién sería el primero en ganar plata con un video de gatitos?'
]) from categories where slug = 'tecnologia';

-- FIESTA / PREVIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el último en irse de la fiesta?',
  '¿Quién sería el primero en quedarse dormido en la previa?',
  '¿Quién sería el primero en hacerse amigo del DJ?',
  '¿Quién sería el primero en pedir "un tema más" cuando ya prendieron las luces?',
  '¿Quién sería el primero en perder el celular en el boliche?',
  '¿Quién sería el primero en terminar comiendo un choripán a las 6 de la mañana?',
  '¿Quién sería el primero en hacer una fiesta en su casa y no limpiar en una semana?',
  '¿Quién sería el primero en colarse en una fiesta a la que no lo invitaron?',
  '¿Quién sería el primero en volver a su casa sin zapatos?',
  '¿Quién sería el primero en adueñarse de la música en la previa?',
  '¿Quién sería el primero en bailar arriba de una mesa?',
  '¿Quién sería el primero en quedarse sin plata a mitad de la noche?',
  '¿Quién sería el primero en ir a una silent disco y cantar a los gritos?',
  '¿Quién sería el primero en despertarse en una casa que no conoce?',
  '¿Quién sería el primero en seguirla en otra fiesta después de la fiesta?',
  '¿Quién sería el primero en decir "me voy en diez minutos" y quedarse tres horas más?',
  '¿Quién sería el primero en olvidarse dónde dejó estacionado el auto?',
  '¿Quién sería el primero en quedarse dormido en el taxi de vuelta?',
  '¿Quién sería el primero en convencer a todos de terminar la noche en un karaoke?',
  '¿Quién sería el primero en hacer un brindis largo e incómodo?',
  '¿Quién sería el primero en llorar en medio de una fiesta?',
  '¿Quién sería el primero en tener el mejor disfraz de la fiesta?',
  '¿Quién sería el primero en discutir con el patovica?',
  '¿Quién sería el primero en hacerse amigo de todo el baño del boliche?',
  '¿Quién sería el primero en desaparecer de la fiesta sin avisar?'
]) from categories where slug = 'fiesta';

-- AMISTAD
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sería el primero en olvidarse de un plan que armó él mismo?',
  '¿Quién sería el primero en cancelar una juntada a último momento?',
  '¿Quién sería el primero en llegar tarde a todas las juntadas?',
  '¿Quién sería el primero en contar un chisme del grupo afuera del grupo?',
  '¿Quién sería el primero en salirse del grupo de WhatsApp?',
  '¿Quién sería el primero en pedir plata prestada y no devolverla?',
  '¿Quién sería el primero en pagar la cuenta de todos?',
  '¿Quién sería el primero en enojarse y no decir nada?',
  '¿Quién sería el primero en defender a alguien del grupo a muerte?',
  '¿Quién sería el primero en desaparecer del grupo cuando se pone en pareja?',
  '¿Quién sería el primero en armar un viaje con el grupo que nunca se hace?',
  '¿Quién sería el primero en dar consejos que nunca aplica?',
  '¿Quién sería el primero en quedarse para siempre con algo que le prestaron?',
  '¿Quién sería el primero en spoilear una fiesta sorpresa?',
  '¿Quién sería el primero en hacerse amigo del ex de alguien del grupo?',
  '¿Quién sería el primero en aparecer en una juntada con alguien nuevo sin avisar?',
  '¿Quién sería el primero en retar a todos cuando se portan mal?',
  '¿Quién sería el primero en llamar a las 4 de la mañana para pedir ayuda?',
  '¿Quién sería el primero en irse a vivir lejos del grupo?',
  '¿Quién sería el primero en seguir siendo amigo de todos dentro de 30 años?'
]) from categories where slug = 'amistad';
