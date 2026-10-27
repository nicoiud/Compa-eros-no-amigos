-- ============================================================
-- ¿QUIÉN...? MÁS COPADAS
--
-- Se retiran las cartas de situaciones absurdas ("casa embrujada",
-- "pedo en clase de yoga") que no generan nada, y entran cartas que
-- juzgan de verdad a la gente de la ronda: quién es el más falso,
-- quién engañaría a su pareja, quién se cree más de lo que es.
-- ============================================================

create temp table cartas_retiradas (text text primary key);

insert into cartas_retiradas (text) values
  ('¿Quién compraría una casa embrujada porque estaba barata?'),
  ('¿Quién le echaría la culpa de todo a Mercurio retrógrado?'),
  ('¿Quién terminaría haciéndose amigo del chorro que le robó?'),
  ('¿Quién discutiría con un nene de 8 años y no lo dejaría ganar?'),
  ('¿Quién llamaría a la policía por un ruido raro que resultó ser su propio lavarropas?'),
  ('¿Quién pagaría un curso de "cómo hacerse millonario" y perdería toda la plata?'),
  ('Si en un avión preguntan "¿hay algún médico a bordo?", ¿quién de acá levantaría la mano igual?'),
  ('¿Quién iría a un velorio sin saber bien quién se murió?'),
  ('¿Quién googlea un dolor de cabeza y termina convencido de que le quedan dos semanas?'),
  ('¿Quién entraría a una secta convencido de que es un "taller de crecimiento personal"?'),
  ('¿Quién fingiría su propia muerte para no pagar una deuda?'),
  ('¿Quién se comería la última porción mirándote a los ojos?'),
  ('¿Quién sería el primero en enojarse en serio jugando a un juego de mesa?'),
  ('¿Quién sería el primero en agarrar el micrófono en un karaoke sin que nadie se lo pida?'),
  ('¿Quién sería el primero en perder el billete ganador de la lotería?'),
  ('¿Quién sería el primero en terminar en una comisaría por una pavada?'),
  ('¿Quién sería el primero en comprarse algo carísimo y devolverlo al día siguiente?'),
  ('¿Quién tiene una carpeta llamada "Proyectos" que en realidad son memes?'),
  ('¿Quién mueve el mouse cada cinco minutos para que figure "conectado"?'),
  ('¿Quién se llevaría la abrochadora, la taza y la silla el día que lo echen?'),
  ('¿Quién dice "excelente pregunta" solo para ganar tiempo y pensar qué contestar?'),
  ('¿Quién entraría en pánico si el jefe le escribe "¿tenés un minuto?"?'),
  ('¿Quién sería el primero en tener el LinkedIn más activo que el Instagram?'),
  ('¿Quién se llevaría resmas, biromes y papel higiénico de la oficina "porque nadie se da cuenta"?'),
  ('¿Quién sería el primero en conectarse a una videollamada sin pantalones?'),
  ('¿Quién se tiraría un pedo en plena clase de yoga?'),
  ('¿Quién se quedaría trabado en el molinete del subte delante de todos?'),
  ('¿Quién le habla con voz de bebé a los perros delante de desconocidos?'),
  ('¿Quién ensaya en voz alta lo que va a decir antes de llamar para pedir una pizza?'),
  ('¿Quién ensaya discusiones en la ducha y las gana todas?'),
  ('¿Quién baila convencido de que lo hace bien?'),
  ('¿Quién respondería "igualmente" a un "feliz cumpleaños"?'),
  ('¿Quién sería el primero en contestar "vos también" cuando el mozo le dice "que lo disfrute"?'),
  ('¿Quién sería el primero en empujar una puerta que decía "tirar"?'),
  ('¿Quién sería el primero en quedarse dormido y babearse en el colectivo?'),
  ('¿Quién sería el primero en ir a dar un beso cuando el otro le daba la mano?'),
  ('¿Quién sería el primero en cantar a los gritos con auriculares sin darse cuenta?'),
  ('¿Quién se despide de todos con mucha onda y tiene que volver porque se olvidó algo?'),
  ('¿Quién se ríe tan fuerte en público que da vergüenza ajena?'),
  ('¿Quién sería el primero en abrazar a un desconocido pensando que era un amigo?'),
  ('¿Quién de acá tiene una foto de perfil vergonzosa que no cambia hace años?'),
  ('¿Quién se saca una selfie en el espejo del gimnasio y la sube sin haber entrenado?'),
  ('¿Quién de acá se perdería con Google Maps abierto?'),
  ('¿Quién llevaría tres valijas para un fin de semana?'),
  ('¿Quién arma el Excel del viaje con horarios cada 15 minutos?'),
  ('¿Quién perdería el avión por quedarse en el free shop?'),
  ('¿Quién iría de campamento sin carpa porque "no puede ser tan difícil"?'),
  ('¿Quién sería el primero en salir corriendo de un tour de fantasmas?'),
  ('¿Quién sería el primero en irse de campamento y volverse la primera noche?'),
  ('¿Quién se haría el que habla inglés y terminaría pidiendo cualquier cosa?'),
  ('¿Quién discutiría con el guía turístico porque "leyó en internet" otra cosa?'),
  ('¿Quién se anotaría en un retiro de silencio y no aguantaría ni una hora?'),
  ('¿Quién pagaría una excursión carísima y se quedaría dormido en el micro?'),
  ('¿Quién sería el primero en llevarse los tuppers de comida de la abuela?'),
  ('¿Quién le pondría a su hijo el nombre de un jugador de fútbol?'),
  ('¿Quién heredaría la casa de los abuelos y la pondría en Airbnb al otro día?'),
  ('¿Quién sería el primero en comerse el postre que otro había guardado en la heladera?'),
  ('¿Quién sería el nieto preferido de la abuela?'),
  ('¿Quién vive con el celular en 3% pidiendo cargador?'),
  ('¿Quién contesta "jajaja" a todo sin haberse reído nunca?'),
  ('¿Quién de acá tiene más pinta de tener un podcast que no escucha nadie?'),
  ('¿Quién sería el primero en tener más de 50 pestañas abiertas?'),
  ('¿Quién sería el primero en usar el celular con la pantalla rota durante años?'),
  ('¿Quién sería el primero en tener 10.000 notificaciones sin leer?'),
  ('¿Quién sería el primero en gastar dinero real en un juego móvil?'),
  ('¿Quién se pelearía a los gritos con el bot de atención al cliente?'),
  ('¿Quién se haría viral bailando en TikTok y después lo negaría?'),
  ('¿Quién sería el primero en usar la misma contraseña para todo?'),
  ('¿Quién le mandaría solicitud de amistad a la mamá de {jugador}?'),
  ('¿Quién de esta ronda baila igual desde 2012?'),
  ('¿Quién, después de dos vasos, empieza a hablar en inglés?'),
  ('¿Quién se pondría a cocinar fideos a las 6 de la mañana en la casa de un desconocido?'),
  ('¿Quién se adueña del parlante y pone el mismo tema tres veces?'),
  ('¿Quién sería el primero en volver a su casa sin zapatos?'),
  ('¿Quién sería el primero en terminar comiendo un choripán a las 6 de la mañana?'),
  ('¿Quién pediría cumbia en un casamiento fino y armaría el trencito?'),
  ('¿Quién iría a una fiesta solo por la comida y se iría después del lunch?');

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

-- CLASICO
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de esta ronda se cree más de lo que es?',
  '¿Quién es el más falso de esta ronda?',
  '¿Quién de acá es el más tacaño?',
  '¿Quién de esta ronda va a ganar más plata?',
  '¿Quién de acá tiene el ego más grande?',
  '¿Quién es el más inmaduro de esta ronda?',
  '¿Quién de acá cambió más desde que lo conocemos?',
  '¿Quién miente más seguido sin que nos demos cuenta?',
  '¿Quién de acá tiene más cara de haber hecho algo ilegal?',
  '¿Quién de esta ronda tiene la vida más resuelta?',
  '¿Quién de acá es más probable que termine solo?',
  '¿Quién es el más rencoroso de esta ronda?',
  '¿Quién nunca pide perdón aunque sepa que se equivocó?',
  '¿Quién es el que más se queja de todo?',
  '¿Quién de acá haría cualquier cosa por plata?',
  '¿Quién es el más envidioso de esta ronda?',
  '¿Quién de acá es el más interesado?',
  '¿A quién de esta ronda le confiarías tu vida?',
  '¿Quién de esta ronda sería mejor padre o madre?',
  '¿Quién es el más dramático de esta ronda?',
  '¿Quién se hace el humilde pero se la re cree?',
  '¿Quién de acá sería el peor presidente?',
  '¿A quién de esta ronda le va a ir mejor en diez años?',
  '¿Quién reacciona peor cuando le dicen que no?'
]) from categories where slug = 'clasico';

-- HOT
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de esta ronda es más probable que engañe a su pareja?',
  '¿Quién de acá tiene más experiencia de la que aparenta?',
  '¿Quién de esta ronda sería el peor ex?',
  '¿Quién de acá sería el mejor en la cama?',
  '¿Quién rompió más corazones de los que admite?',
  '¿Quién es el más celoso de esta ronda?',
  '¿Con quién de esta ronda tendría {jugador} una noche loca?',
  '¿Quién de acá es el más fácil de conquistar?',
  '¿Quién de esta ronda estuvo con más gente?'
]) from categories where slug = 'hot';

-- TRABAJO
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de esta ronda sería el jefe más tóxico?',
  '¿Quién le serrucharía el piso a un compañero por un ascenso?',
  '¿Quién de esta ronda trabaja menos y cobra más?',
  '¿Quién de acá va a llegar más lejos en su carrera?'
]) from categories where slug = 'trabajo';

-- VERGUENZAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá tiene el secreto más vergonzoso que nunca contó?',
  '¿Quién dice que no le importa lo que piensan los demás y le importa muchísimo?'
]) from categories where slug = 'verguenzas';

-- AVENTURAS
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién abandonaría el viaje del grupo por un levante?',
  '¿Quién de acá se iría a vivir afuera y no volvería nunca más?',
  '¿Quién arruinaría un viaje del grupo con su mal humor?',
  '¿Quién dejaría todo mañana para dar la vuelta al mundo?'
]) from categories where slug = 'aventuras';

-- FAMILIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de esta ronda va a ser el primero en tener hijos?',
  '¿Quién de acá es la oveja negra de su familia?',
  '¿Quién es el preferido de sus viejos y lo usa a su favor?'
]) from categories where slug = 'familia';

-- TECNOLOGIA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién sube historias solo para que las vea una persona?',
  '¿Quién tiene el Instagram más armado y la vida más desarmada?',
  '¿Quién vive pendiente de quién vio sus historias?'
]) from categories where slug = 'tecnologia';

-- FIESTA
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de esta ronda es el peor borracho?',
  '¿Quién de acá es el alma de la fiesta?',
  '¿Quién se pone más pesado cuando toma?',
  '¿Quién es el que más se arrepiente al día siguiente?'
]) from categories where slug = 'fiesta';

-- AMISTAD
insert into cards (category_id, text) select id, unnest(array[
  '¿Quién de acá es el amigo más leal?',
  '¿Quién nos dejaría plantados por una cita?',
  '¿Quién se borra justo cuando más lo necesitás?',
  '¿Quién tiene favoritos en el grupo y se le nota?',
  '¿Quién habla de todos pero nadie sabe nada de su vida?',
  '¿Quién siempre tiene que tener la última palabra?',
  '¿Quién de acá sería el peor compañero de viaje?'
]) from categories where slug = 'amistad';
