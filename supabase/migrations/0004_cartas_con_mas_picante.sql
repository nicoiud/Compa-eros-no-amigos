-- ============================================================
-- CARTAS CON MÁS PICANTE
--
-- El mazo anterior tenía muchas cartas "de actividad" (hacerse famoso,
-- aprender a surfear, escribir un libro) que no generan debate. Acá:
--
-- 1. Se afilan/reescriben en el lugar algunas cartas que se quedan
--    (mismo id, solo si el texto sigue siendo el original).
-- 2. Se retiran las cartas básicas: se borran si nada las referencia
--    y si no, se desactivan.
-- 3. Se agregan cartas nuevas que juzgan a la persona, con situaciones
--    concretas, distintos arranques y cartas con {jugador}
--    (el juego lo reemplaza por alguien de la ronda al azar).
-- ============================================================

-- ------------------------------------------------------------
-- 1. REESCRITURAS
-- ------------------------------------------------------------

update cards c set text = v.new_text
from (values
  ('¿Quién sería el primero en gastar su sueldo completo en un capricho?',
   '¿Quién se gastaría el sueldo entero el día que cobra y comería fideos el resto del mes?'),
  ('¿Quién sería el primero en fingir que duerme para no tener una conversación incómoda?',
   '¿Quién de acá se haría el dormido para no tener una conversación incómoda?'),
  ('¿Quién sería el primero en comerse la última porción sin preguntar?',
   '¿Quién se comería la última porción mirándote a los ojos?'),
  ('¿Quién sería el primero en contar un secreto que le pidieron guardar?',
   '¿Quién de esta ronda es incapaz de guardar un secreto más de 24 horas?'),
  ('¿Quién sería el primero en besar a alguien del grupo?',
   '¿Quién de esta ronda ya se chapó a alguien del grupo y nunca lo contó?'),
  ('¿Quién sería el primero en mandar un mensaje al ex a las 3am?',
   '¿Quién le mandaría un "¿estás despierto?" a su ex a las 3 de la mañana?'),
  ('¿Quién sería el primero en revisar el celular de su pareja?',
   '¿Quién le revisaría el celular a su pareja mientras se baña?'),
  ('¿Quién sería el primero en tener un crush con un/a profe o jefe/a?',
   '¿Quién de acá tuvo un crush con un profesor o con su jefe?'),
  ('¿Quién sería el primero en cortar una relación por mensaje?',
   '¿Quién cortaría una relación por WhatsApp... con un audio?'),
  ('¿Quién sería el primero en tener un crush secreto con alguien de esta ronda?',
   '¿Quién de acá tiene un crush secreto con alguien de esta ronda?'),
  ('¿Quién sería el primero en volver con su ex?',
   '¿Quién juró "nunca más con mi ex" y ya volvió dos veces?'),
  ('¿Quién prefiere saber la verdad aunque duela antes que vivir engañado?',
   '¿Quién preferiría no enterarse nunca de una infidelidad antes que saber la verdad?'),
  ('¿Quién sería el primero en llevarse algo de la oficina para su casa?',
   '¿Quién se llevaría resmas, biromes y papel higiénico de la oficina "porque nadie se da cuenta"?')
) as v(old_text, new_text)
where c.text = v.old_text and c.visibility = 'official';

-- ------------------------------------------------------------
-- 2. CARTAS QUE SE RETIRAN
-- ------------------------------------------------------------

create temp table cartas_retiradas (text text primary key);

insert into cartas_retiradas (text) values
  ('¿Quién sería el primero en adoptar cinco gatos sin pensarlo?'),
  ('¿Quién sería el primero en aparecer en televisión haciendo el ridículo?'),
  ('¿Quién sería el primero en bloquear a alguien sin motivo aparente?'),
  ('¿Quién sería el primero en convertirse en vegano de la noche a la mañana?'),
  ('¿Quién sería el primero en hacerse un tatuaje enorme y visible?'),
  ('¿Quién sería el primero en irse antes de que termine la fiesta?'),
  ('¿Quién sería el primero en irse de viaje sin avisar a nadie?'),
  ('¿Quién sería el primero en llorar en una película de Disney?'),
  ('¿Quién sería el primero en mudarse solo a otro país?'),
  ('¿Quién sería el primero en olvidarse del cumpleaños de su mejor amigo?'),
  ('¿Quién sería el primero en pedir perdón después de una pelea?'),
  ('¿Quién sería el primero en perder todo su dinero en una apuesta?'),
  ('¿Quién sería el primero en renunciar al trabajo sin tener otro?'),
  ('¿Quién sería el primero en vender un riñón por dinero?'),
  ('¿Quién sería el primero en abrir su propio restaurante?'),
  ('¿Quién sería el primero en comerse un bicho si le pagan?'),
  ('¿Quién sería el primero en conocer a su ídolo y quedarse mudo?'),
  ('¿Quién sería el primero en dejar todo para irse a vivir a la playa?'),
  ('¿Quién sería el primero en escribir un libro?'),
  ('¿Quién sería el primero en hacerse famoso?'),
  ('¿Quién sería el primero en hacerse influencer?'),
  ('¿Quién sería el primero en hacerse millonario?'),
  ('¿Quién sería el primero en llorar en un casamiento ajeno?'),
  ('¿Quién sería el primero en quedarse afuera de su casa con las llaves adentro?'),
  ('¿Quién sería el primero en quedarse dormido en el cine?'),
  ('¿Quién sería el primero en quedarse sin nafta en la ruta?'),
  ('¿Quién sería el primero en raparse por una apuesta?'),
  ('¿Quién sería el primero en sobrevivir a un apocalipsis zombie?'),
  ('¿Quién sería el primero en tener una mascota exótica?'),
  ('¿Quién sería el primero en teñirse el pelo de un color flúor?'),
  ('¿Quién sería el primero en tirarse a la pileta con ropa?'),
  ('¿Quién sería el primero en enamorarse de alguien inalcanzable?'),
  ('¿Quién sería el primero en hacer algo loco por amor?'),
  ('¿Quién sería el primero en tener una cita con alguien que conoció en internet?'),
  ('¿Quién sería el primero en aceptar una cita a ciegas?'),
  ('¿Quién sería el primero en casarse con alguien que conoce hace menos de un año?'),
  ('¿Quién sería el primero en chaparse a un desconocido en el boliche?'),
  ('¿Quién sería el primero en confesarle a alguien que le gusta en medio de una fiesta?'),
  ('¿Quién sería el primero en dar el primer paso?'),
  ('¿Quién sería el primero en enamorarse en un viaje?'),
  ('¿Quién sería el primero en escribirle una carta de amor a alguien?'),
  ('¿Quién sería el primero en quedarse a dormir en lo de alguien que conoció esa noche?'),
  ('¿Quién sería el primero en tener un amigovio?'),
  ('¿Quién sería el primero en tener un amor de verano?'),
  ('¿Quién sería el primero en tener una relación a distancia?'),
  ('¿Quién sería el primero en terminar la primera cita en su casa?'),
  ('¿Quién prefiere comer lo mismo todos los días antes que probar algo nuevo?'),
  ('¿Quién prefiere dormir 12 horas antes que aprovechar el día?'),
  ('¿Quién prefiere gastar en experiencias antes que en cosas materiales?'),
  ('¿Quién prefiere la comida rápida antes que un restaurante elegante?'),
  ('¿Quién prefiere leer antes que mirar series?'),
  ('¿Quién prefiere pasar desapercibido antes que ser el centro de atención?'),
  ('¿Quién prefiere pedir perdón antes que tener razón?'),
  ('¿Quién prefiere quedarse en casa antes que salir un viernes?'),
  ('¿Quién prefiere tener pocos amigos muy cercanos antes que muchos conocidos?'),
  ('¿Quién prefiere trabajar solo antes que en equipo?'),
  ('¿Quién prefiere un plan espontáneo antes que algo organizado con semanas de anticipación?'),
  ('¿Quién prefiere caminar veinte cuadras antes que tomarse un taxi?'),
  ('¿Quién prefiere cocinar antes que pedir delivery?'),
  ('¿Quién prefiere el frío antes que el calor?'),
  ('¿Quién prefiere el mate amargo antes que dulce?'),
  ('¿Quién prefiere escuchar la misma playlist de siempre antes que descubrir música nueva?'),
  ('¿Quién prefiere ir al cine solo antes que no ir?'),
  ('¿Quién prefiere la montaña antes que la playa?'),
  ('¿Quién prefiere levantarse temprano antes que quedarse despierto hasta tarde?'),
  ('¿Quién prefiere llegar una hora antes que cinco minutos tarde?'),
  ('¿Quién prefiere mandar audios antes que escribir?'),
  ('¿Quién prefiere que le spoileen una serie antes que esperar al final?'),
  ('¿Quién prefiere quedarse callado antes que decir lo que piensa?'),
  ('¿Quién prefiere salir a bailar antes que una juntada tranqui?'),
  ('¿Quién prefiere tener mucha plata y poco tiempo antes que mucho tiempo y poca plata?'),
  ('¿Quién prefiere un asado con amigos antes que una cena elegante?'),
  ('¿Quién prefiere un gato antes que un perro?'),
  ('¿Quién prefiere viajar solo antes que con amigos?'),
  ('¿Quién prefiere vivir en el campo antes que en la ciudad?'),
  ('¿Quién prefiere volver a ver una serie antes que empezar una nueva?'),
  ('¿Quién sería el primero en dejar el trabajo para montar un emprendimiento riesgoso?'),
  ('¿Quién sería el primero en dormirse en una reunión importante?'),
  ('¿Quién sería el primero en hacer home office desde la cama todo el día?'),
  ('¿Quién sería el primero en hacerle ghosting a un cliente difícil?'),
  ('¿Quién sería el primero en ignorar un correo urgente de su jefe por horas?'),
  ('¿Quién sería el primero en mandar un mensaje equivocado al grupo de trabajo?'),
  ('¿Quién sería el primero en armar un chusmerío en la oficina?'),
  ('¿Quién sería el primero en clavar el visto en el grupo del laburo?'),
  ('¿Quién sería el primero en comprar facturas para todos para caer bien?'),
  ('¿Quién sería el primero en contestar mails desde la playa en plenas vacaciones?'),
  ('¿Quién sería el primero en escribirle mal el nombre a un cliente importante?'),
  ('¿Quién sería el primero en hacer stand-up en la fiesta de fin de año de la empresa?'),
  ('¿Quién sería el primero en hacerse amigo del jefe?'),
  ('¿Quién sería el primero en jugar a algo en la compu en horario laboral?'),
  ('¿Quién sería el primero en llevar tupper todos los días?'),
  ('¿Quién sería el primero en organizar el amigo invisible de la oficina?'),
  ('¿Quién sería el primero en pedirse vacaciones el primer mes?'),
  ('¿Quién sería el primero en terminar casado con alguien del trabajo?'),
  ('¿Quién sería el primero en equivocarse de baño y tardar en darse cuenta?'),
  ('¿Quién sería el primero en hacer un chiste que no le causa gracia a nadie?'),
  ('¿Quién sería el primero en llegar tarde a su propia despedida?'),
  ('¿Quién sería el primero en mandar un audio de voz al grupo equivocado?'),
  ('¿Quién sería el primero en reírse en un momento completamente inapropiado?'),
  ('¿Quién sería el primero en tropezarse al bajar de un colectivo?'),
  ('¿A quién agarrarían primero hablando solo por la calle?'),
  ('¿A quién se le rompería primero el pantalón en público?'),
  ('¿Quién sería el primero en caerse en la pista de baile?'),
  ('¿Quién sería el primero en hacerse viral por un video vergonzoso?'),
  ('¿Quién sería el primero en llorar viendo una publicidad?'),
  ('¿Quién sería el primero en mandar sin querer un audio de cinco minutos?'),
  ('¿Quién sería el primero en pasar toda la noche con algo entre los dientes?'),
  ('¿Quién sería el primero en quedarse en blanco en una exposición oral?'),
  ('¿Quién sería el primero en quedarse encerrado en un baño?'),
  ('¿Quién sería el primero en salir a la calle con la etiqueta de la ropa puesta?'),
  ('¿Quién sería el primero en dormir en la calle por no encontrar alojamiento?'),
  ('¿Quién sería el primero en escalar una montaña sin entrenamiento previo?'),
  ('¿Quién sería el primero en hacer autostop?'),
  ('¿Quién sería el primero en hacer un viaje sin planificar nada?'),
  ('¿Quién sería el primero en hacerse amigo de alguien con quien no puede hablar por el idioma?'),
  ('¿Quién sería el primero en mudarse a vivir en una van?'),
  ('¿Quién sería el primero en nadar con tiburones?'),
  ('¿Quién sería el primero en perderse en una ciudad extranjera y no entrar en pánico?'),
  ('¿Quién sería el primero en subirse a una moto de un desconocido para llegar más rápido?'),
  ('¿Quién sería el primero en tirarse en paracaídas sin pensarlo dos veces?'),
  ('¿Quién sería el primero en vivir un año en un pueblo sin wifi?'),
  ('¿Quién sería el primero en anotarse en una maratón sin haber entrenado?'),
  ('¿Quién sería el primero en aprender a surfear?'),
  ('¿Quién sería el primero en comerse un escorpión?'),
  ('¿Quién sería el primero en cruzar la cordillera en auto?'),
  ('¿Quién sería el primero en dormir bajo las estrellas en el medio de la nada?'),
  ('¿Quién sería el primero en hacer bungee jumping?'),
  ('¿Quién sería el primero en irse a vivir a una isla?'),
  ('¿Quién sería el primero en irse de safari?'),
  ('¿Quién sería el primero en meterse al agua helada en pleno invierno?'),
  ('¿Quién sería el primero en perder un vuelo?'),
  ('¿Quién sería el primero en recorrer Sudamérica en bici?'),
  ('¿Quién sería el primero en salir de noche en un país que no conoce y volver con amigos nuevos?'),
  ('¿Quién sería el primero en subirse a un toro mecánico?'),
  ('¿Quién sería el primero en subirse tres veces seguidas a la montaña rusa más grande?'),
  ('¿Quién sería el primero en tirarse de un acantilado al agua?'),
  ('¿Quién sería el primero en viajar a otro país solo para ir a un festival?'),
  ('¿Quién sería el primero en volar en globo aerostático?'),
  ('¿Quién sería el primero en llegar tarde a una comida familiar importante?'),
  ('¿Quién sería el primero en tener hijos?'),
  ('¿Quién sería el primero en casarse?'),
  ('¿Quién sería el primero en contarle a su mamá algo que no debía?'),
  ('¿Quién sería el primero en convertirse en el tío o la tía copada de la familia?'),
  ('¿Quién sería el primero en llevar a una cita a un casamiento familiar?'),
  ('¿Quién sería el primero en llorar en el casamiento de un primo?'),
  ('¿Quién sería el primero en mudarse a la casa de los suegros?'),
  ('¿Quién sería el primero en olvidarse del cumpleaños de su mamá?'),
  ('¿Quién sería el primero en organizar todas las reuniones familiares?'),
  ('¿Quién sería el primero en pelearse con un hermano por el control remoto siendo adulto?'),
  ('¿Quién sería el primero en tener el auto más viejo de la familia y negarse a cambiarlo?'),
  ('¿Quién sería el primero en tener más de tres hijos?'),
  ('¿Quién sería el primero en volver a vivir con sus padres?'),
  ('¿Quién sería el primero en comprar algo caro por internet y que llegue completamente diferente?'),
  ('¿Quién sería el primero en dejar que el autocorrector le arruine un mensaje importante?'),
  ('¿Quién sería el primero en olvidarse todas las contraseñas y bloquear su cuenta?'),
  ('¿Quién sería el primero en pasar 12 horas viendo videos de YouTube sin parar?'),
  ('¿Quién sería el primero en pelearse a los gritos con Siri o Alexa?'),
  ('¿Quién sería el primero en perder el celular en una salida y no darse cuenta hasta horas después?'),
  ('¿Quién sería el primero en quedarse sin batería en el momento más crítico?'),
  ('¿Quién sería el primero en abrirse un canal de YouTube?'),
  ('¿Quién sería el primero en aguantar un mes sin celular?'),
  ('¿Quién sería el primero en borrar todas sus redes sociales?'),
  ('¿Quién sería el primero en comprarse el último celular el día que sale?'),
  ('¿Quién sería el primero en enamorarse de alguien por chat sin haberlo visto nunca?'),
  ('¿Quién sería el primero en ganar plata con un video de gatitos?'),
  ('¿Quién sería el primero en jugar 24 horas seguidas a un videojuego?'),
  ('¿Quién sería el primero en llegar al millón de seguidores?'),
  ('¿Quién sería el primero en olvidarse el celular en un taxi?'),
  ('¿Quién sería el primero en quedarse toda la noche scrolleando TikTok?'),
  ('¿Quién sería el primero en ver una temporada entera en un día?'),
  ('¿Quién sería el primero en adueñarse de la música en la previa?'),
  ('¿Quién sería el primero en bailar arriba de una mesa?'),
  ('¿Quién sería el primero en convencer a todos de terminar la noche en un karaoke?'),
  ('¿Quién sería el primero en hacer una fiesta en su casa y no limpiar en una semana?'),
  ('¿Quién sería el primero en hacerse amigo del DJ?'),
  ('¿Quién sería el primero en ir a una silent disco y cantar a los gritos?'),
  ('¿Quién sería el primero en llorar en medio de una fiesta?'),
  ('¿Quién sería el primero en olvidarse dónde dejó estacionado el auto?'),
  ('¿Quién sería el primero en perder el celular en el boliche?'),
  ('¿Quién sería el primero en quedarse dormido en el taxi de vuelta?'),
  ('¿Quién sería el primero en quedarse sin plata a mitad de la noche?'),
  ('¿Quién sería el primero en seguirla en otra fiesta después de la fiesta?'),
  ('¿Quién sería el primero en tener el mejor disfraz de la fiesta?'),
  ('¿Quién sería el último en irse de la fiesta?'),
  ('¿Quién sería el primero en defender a alguien del grupo a muerte?'),
  ('¿Quién sería el primero en irse a vivir lejos del grupo?'),
  ('¿Quién sería el primero en llamar a las 4 de la mañana para pedir ayuda?'),
  ('¿Quién sería el primero en pagar la cuenta de todos?'),
  ('¿Quién sería el primero en retar a todos cuando se portan mal?'),
  ('¿Quién sería el primero en salirse del grupo de WhatsApp?'),
  ('¿Quién sería el primero en seguir siendo amigo de todos dentro de 30 años?');

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

-- ------------------------------------------------------------
-- 3. CARTAS NUEVAS
-- ------------------------------------------------------------

-- CLÁSICO
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá moriría primero en una película de terror?',
  '¿Quién de esta ronda tiene más pinta de llevar una doble vida?',
  '¿Quién terminaría en un documental de Netflix, y no justamente como la víctima?',
  '¿Quién de acá vendería al grupo entero por un viaje pago al Caribe?',
  '¿Quién mentiría en su CV y lo contratarían igual?',
  '¿Quién de esta ronda tiene más secretos que nadie conoce?',
  'Si el grupo cometiera un crimen, ¿quién sería el primero en delatar a todos?',
  'Si el grupo cometiera un crimen, ¿quién sería el cerebro del plan?',
  '¿Quién ganaría Gran Hermano haciendo alianzas con todos y traicionándolos al final?',
  '¿Quién se gastaría en una semana la plata de un premio que le cambia la vida?',
  '¿Quién entraría a una secta convencido de que es un "taller de crecimiento personal"?',
  '¿Quién de acá podría convencer a cualquiera de cualquier cosa?',
  'Si en un avión preguntan "¿hay algún médico a bordo?", ¿quién de acá levantaría la mano igual?',
  '¿Quién llamaría a la policía por un ruido raro que resultó ser su propio lavarropas?',
  '¿Quién fingiría su propia muerte para no pagar una deuda?',
  '¿Quién pagaría un curso de "cómo hacerse millonario" y perdería toda la plata?',
  '¿Quién de esta ronda sería el peor compañero de departamento?',
  '¿Quién googlea un dolor de cabeza y termina convencido de que le quedan dos semanas?',
  '¿Quién terminaría haciéndose amigo del chorro que le robó?',
  '¿Quién discutiría con un nene de 8 años y no lo dejaría ganar?',
  '¿Quién de acá tiene una opinión fuerte sobre absolutamente todo?',
  '¿Quién le echaría la culpa de todo a Mercurio retrógrado?',
  '¿Quién iría a un velorio sin saber bien quién se murió?',
  'Si {jugador} llamara a las 3 de la mañana diciendo "necesito una pala", ¿quién iría sin preguntar nada?',
  '¿Quién de acá le tiene un poquito de miedo a {jugador}?',
  '¿Quién compraría una casa embrujada porque estaba barata?'
]) from categories where slug = 'clasico';

-- HOT / PICANTE
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá tiene la lista de ex más larga?',
  '¿Quién de esta ronda tiene más pinta de tener un perfil secreto en una app de citas?',
  '¿Quién de acá se chaparía a {jugador} si nadie se enterara nunca?',
  '¿Quién guarda capturas de los chats con sus ex "por las dudas"?',
  '¿Quién de acá fingió alguna vez en la cama para terminar más rápido?',
  '¿Quién aceptaría una cita con alguien que no le gusta solo porque invita la cena?',
  '¿Quién de acá se enamora en tres días y se desenamora en dos?',
  '¿Quién copia y pega el mismo mensaje para chamuyar a tres personas a la vez?',
  '¿Quién terminaría saliendo con el ex de un amigo?',
  '¿Quién tiene un "amigo" que todos sabemos que no es solo un amigo?',
  '¿Quién se pone celoso de los amigos de su pareja?',
  '¿Quién de esta ronda tiene el peor ojo para elegir pareja?',
  '¿Quién saldría con alguien solo por cómo besa?',
  '¿Quién de acá le escribiría a {jugador} en pedo a las 4 de la mañana?',
  '¿Quién lo haría en el probador de un local de ropa?',
  '¿Quién graba un audio hot y lo escucha cinco veces antes de mandarlo?',
  '¿Quién dejaría a alguien por cómo escribe en WhatsApp?',
  '¿Quién le pediría el número al mozo estando en una cita con otra persona?',
  '¿Quién tiene más contactos agendados tipo "Martín Gym" o "Flor Boliche"?',
  '¿Quién se tatuaría el nombre de su pareja al tercer mes?',
  '¿Quién de acá terminaría saliendo con alguien de la familia de {jugador}?',
  '¿Quién de esta ronda tuvo un crush con la pareja de un amigo?',
  '¿Quién borraría el historial del celular antes de prestárselo a cualquiera?'
]) from categories where slug = 'hot';

-- ¿QUIÉN PREFIERE...?
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién preferiría que lo dejen en visto antes que recibir un audio de cuatro minutos?',
  '¿Quién preferiría ser rico y odiado antes que pobre y querido?',
  '¿Quién preferiría revisarle el celular a su pareja antes que preguntarle de frente?',
  '¿Quién preferiría quedar encerrado en un ascensor con su ex antes que con su jefe?',
  '¿Quién preferiría cancelar un plan con amigos antes que cancelar una siesta?',
  '¿Quién preferiría tener razón antes que ser feliz?',
  '¿Quién preferiría que su mamá lea sus chats antes que su historial de búsqueda?',
  '¿Quién preferiría no comer nunca más asado antes que dormir una noche en un camping?',
  '¿Quién preferiría ser famoso por algo vergonzoso antes que no ser famoso nunca?',
  '¿Quién preferiría pagar de más antes que pedir que dividan la cuenta?',
  '¿Quién preferiría mudarse de país antes que cruzarse a su ex en el súper?',
  '¿Quién preferiría comer algo vencido antes que tirar comida?',
  '¿Quién preferiría ganar Gran Hermano antes que recibirse?',
  '¿Quién preferiría estar un mes sin mate antes que una semana sin WhatsApp?',
  '¿Quién preferiría trabajar gratis de lo que ama antes que cobrar bien en algo que odia?',
  '¿Quién preferiría ir solo a un casamiento antes que llevar a alguien que no le gusta?',
  '¿Quién preferiría inventar una respuesta antes que admitir que no sabe algo?',
  '¿Quién preferiría que lo odien antes que pasar desapercibido?',
  '¿Quién preferiría perder un vuelo antes que llegar dos horas antes al aeropuerto?',
  '¿Quién preferiría contar un secreto de {jugador} antes que uno propio?'
]) from categories where slug = 'quien-prefiere';

-- TRABAJO / OFICINA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá es el más chupamedias con el jefe?',
  '¿Quién tiene más pinta de tener dos trabajos full time a la vez sin que ninguno se entere?',
  '¿Quién pone "trabajo bien bajo presión" en el CV y entra en pánico con un mail?',
  '¿Quién tiene una carpeta llamada "Proyectos" que en realidad son memes?',
  '¿Quién de acá dice "lo vemos el lunes" y nunca lo ve?',
  '¿Quién sería el jefe más insoportable de todos?',
  '¿Quién renunciaría por mail y a la semana pediría volver?',
  '¿Quién mueve el mouse cada cinco minutos para que figure "conectado"?',
  '¿Quién se haría el enfermo un viernes y subiría historias desde la playa?',
  '¿Quién de esta ronda está a un mal día de renunciar en serio?',
  '¿Quién terminaría siendo el jefe de todos los que están acá?',
  '¿Quién dice "excelente pregunta" solo para ganar tiempo y pensar qué contestar?',
  '¿Quién se quejaría del jefe en un audio y se lo mandaría al jefe?',
  '¿Quién inventaría un problema de conexión para cortar una videollamada?',
  '¿Quién se llevaría la abrochadora, la taza y la silla el día que lo echen?',
  '¿Quién asiente en todas las reuniones sin tener idea de qué se está hablando?',
  '¿Quién entraría en pánico si el jefe le escribe "¿tenés un minuto?"?',
  '¿Quién le pediría a {jugador} que lo cubra en el laburo y nunca le devolvería el favor?',
  '¿Quién de acá ya está buscando otro trabajo en horario laboral?'
]) from categories where slug = 'trabajo';

-- VERGÜENZAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién ensaya discusiones en la ducha y las gana todas?',
  '¿Quién ensaya en voz alta lo que va a decir antes de llamar para pedir una pizza?',
  '¿Quién cortaría una llamada con el jefe diciendo "te quiero, chau"?',
  '¿Quién de esta ronda tiene la galería del celular más imposible de mostrar?',
  '¿Quién se quedaría diez minutos charlando con alguien sin tener idea de quién es?',
  '¿Quién se tiraría un pedo en plena clase de yoga?',
  '¿Quién contaría como propia una anécdota de otro delante del que la vivió?',
  '¿Quién baila convencido de que lo hace bien?',
  '¿Quién se quedaría trabado en el molinete del subte delante de todos?',
  '¿Quién le preguntaría a alguien para cuándo es el bebé y no estaba embarazada?',
  '¿Quién se despide de todos con mucha onda y tiene que volver porque se olvidó algo?',
  '¿Quién respondería "igualmente" a un "feliz cumpleaños"?',
  '¿Quién de acá tiene una foto de perfil vergonzosa que no cambia hace años?',
  '¿Quién le habla con voz de bebé a los perros delante de desconocidos?',
  '¿Quién se ríe tan fuerte en público que da vergüenza ajena?',
  '¿Quién se saca una selfie en el espejo del gimnasio y la sube sin haber entrenado?'
]) from categories where slug = 'verguenzas';

-- AVENTURAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá se perdería con Google Maps abierto?',
  '¿Quién llevaría tres valijas para un fin de semana?',
  '¿Quién se haría amigo de un local en un viaje y terminaría invitado a su casamiento?',
  '¿Quién sería el primero en entrar en pánico si nos perdemos en la montaña?',
  'Si el grupo quedara perdido en la selva, ¿quién terminaría siendo el líder?',
  '¿Quién terminaría internado por comer en un puesto callejero en un viaje?',
  '¿Quién se anotaría en un retiro de silencio y no aguantaría ni una hora?',
  '¿Quién pagaría una excursión carísima y se quedaría dormido en el micro?',
  '¿Quién volvería de un viaje con un tatuaje en un idioma que no sabe qué dice?',
  '¿Quién discutiría con el guía turístico porque "leyó en internet" otra cosa?',
  '¿Quién arma el Excel del viaje con horarios cada 15 minutos?',
  '¿Quién perdería el avión por quedarse en el free shop?',
  '¿Quién viajaría a la otra punta del mundo detrás de alguien que conoció una noche?',
  '¿Quién se haría el que habla inglés y terminaría pidiendo cualquier cosa?',
  '¿Quién de acá abandonaría a {jugador} en una isla desierta para salvarse?',
  '¿Quién volvería de mochilear "cambiado" y hablando de energías?',
  '¿Quién iría de campamento sin carpa porque "no puede ser tan difícil"?'
]) from categories where slug = 'aventuras';

-- FAMILIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá es el favorito de su mamá y lo sabe?',
  '¿Quién llevaría una pareja distinta a cada Navidad?',
  '¿Quién le sigue pidiendo a su mamá que le saque turno con el médico?',
  '¿Quién le contesta "estoy llegando" a su familia sin haber salido de la cama?',
  '¿Quién sigue llevando la ropa sucia a lavar a la casa de sus viejos?',
  '¿Quién de esta ronda tiene una foto de chico que jamás dejaría que veamos?',
  '¿Quién terminaría siendo igual a su papá o a su mamá y lo negaría hasta la muerte?',
  '¿Quién le pondría a su hijo el nombre de un jugador de fútbol?',
  '¿Quién se haría el dormido en la sobremesa para no lavar los platos?',
  '¿Quién de acá jamás dejaría a {jugador} cuidando a sus hijos?',
  '¿Quién heredaría la casa de los abuelos y la pondría en Airbnb al otro día?',
  '¿Quién sería el más sobreprotector con sus hijos?',
  '¿Quién le diría a su familia que está "en la biblioteca" estando en un boliche?'
]) from categories where slug = 'familia';

-- TECNOLOGÍA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá tiene el historial de búsqueda más perturbador?',
  '¿Quién se pelearía a los gritos con el bot de atención al cliente?',
  '¿Quién de acá tiene una cuenta secreta que nadie de esta ronda conoce?',
  '¿Quién silencia las historias de gente que ve todos los días?',
  '¿Quién le preguntaría a una IA si está bien cortar con su pareja?',
  '¿Quién vive con el celular en 3% pidiendo cargador?',
  '¿Quién contesta "jajaja" a todo sin haberse reído nunca?',
  '¿Quién le sacaría captura a un chat de este grupo y la mandaría a otro grupo?',
  '¿Quién de acá tiene más pinta de tener un podcast que no escucha nadie?',
  '¿Quién subiría una historia "pidiendo privacidad" después de pelearse con su pareja?',
  '¿Quién le mandaría solicitud de amistad a la mamá de {jugador}?',
  '¿Quién tiene un mensaje para su ex escrito en borradores hace meses?',
  '¿Quién stalkearía a su próxima cita hasta saber cómo se llama su perro?',
  '¿Quién se haría viral bailando en TikTok y después lo negaría?'
]) from categories where slug = 'tecnologia';

-- FIESTA / PREVIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién dice "una más y nos vamos" y pide otra ronda?',
  '¿Quién siempre termina cuidando al que se pasó de copas?',
  '¿Quién se pone sentimental a las 4 de la mañana y les dice "te amo" a todos?',
  '¿Quién pediría cumbia en un casamiento fino y armaría el trencito?',
  '¿Quién iría a una fiesta solo por la comida y se iría después del lunch?',
  '¿Quién llega a la previa con una bolsa de hielo y se va con todo lo que trajeron los demás?',
  '¿Quién de esta ronda baila igual desde 2012?',
  '¿Quién se adueña del parlante y pone el mismo tema tres veces?',
  '¿Quién, después de dos vasos, empieza a hablar en inglés?',
  '¿Quién terminaría la fiesta discutiendo de política en la cocina?',
  '¿Quién se pierde en el boliche y aparece dos horas después sin dar explicaciones?',
  '¿Quién le mandaría a {jugador} un audio a las 5 de la mañana que no se entiende nada?',
  '¿Quién se pondría a cocinar fideos a las 6 de la mañana en la casa de un desconocido?',
  '¿Quién organizaría la previa y se dormiría antes de que lleguen todos?',
  '¿Quién siempre "conoce a alguien" en la puerta para entrar gratis y nunca funciona?'
]) from categories where slug = 'fiesta';

-- AMISTAD
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá tiene un grupo de WhatsApp paralelo para hablar del resto?',
  '¿Quién de esta ronda habla mal de {jugador} cuando no está?',
  '¿Quién le cuenta todo a su pareja, incluso lo que le contamos en secreto?',
  '¿Quién de acá nos traicionaría por un ascenso?',
  '¿Quién siempre "se olvida" la billetera cuando llega la cuenta?',
  '¿Quién dejaría de hablarnos si se hiciera famoso?',
  '¿Quién de acá va a ser el padrino o la madrina de casamiento de {jugador}?',
  '¿Quién organizaría una intervención si alguien del grupo sale con alguien que no nos gusta?',
  '¿Quién contesta los mensajes del grupo una semana después como si nada?',
  '¿Quién tiene fotos comprometedoras de todos los de esta ronda?',
  '¿Quién es el "amigo terapeuta" que escucha a todos y nunca cuenta nada suyo?',
  '¿Quién vendería un secreto de {jugador} por una pizza?',
  '¿Quién de acá tiene un amigo favorito en esta ronda y no lo dice?',
  '¿Quién le diría la verdad a {jugador} aunque duela?',
  '¿Quién se ofendería porque no lo invitaron a un plan al que no pensaba ir?'
]) from categories where slug = 'amistad';
