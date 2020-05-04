const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
      });
bg = new Vue({
el: '#buhgame',
data: {
  allQusets: [["Основные средства",	"01"],
			["Амортизация основных средств",	"02"],
			["Доходные вложения в материальные ценности",	"03"],
			["Нематериальные активы",	"04"],
			["Амортизация нематериальных активов",	"05"],
			["Оборудование к установке",	"07"],
			["Вложения во внеоборотные активы",	"08"],
			["Отложенные налоговые активы",	"09"],
			["Материалы",	"10"],
			["Животные на выращивании и откорме",	"11"],
			["Резервы под снижение стоимости материальных ценностей",	"14"],
			["Заготовление и приобретение материальных ценностей",	"15"],
			["Отклонение в стоимости материальных ценностей",	"16"],
			["Налог на добавленную стоимость по приобретенным ценностям",	"19"],
			["Основное производство",	"20"],
			["Полуфабрикаты собственного производства",	"21"],
			["Вспомогательные производства",	"23"],
			["Общепроизводственные расходы",	"25"],
			["Общехозяйственные расходы",	"26"],
			["Брак в производстве",	"28"],
			["Обслуживающие производства и хозяйства",	"29"],
			["Выпуск продукции (работ, услуг)",	"40"],
			["Товары",	"41"],
			["Торговая наценка",	"42"],
			["Готовая продукция",	"43"],
			["Расходы на продажу",	"44"],
			["Товары отгруженные",	"45"],
			["Выполненные этапы по незавершенным работам",	"46"],
			["Касса",	"50"],
			["Расчетные счета",	"51"],
			["Валютные счета",	"52"],
			["Специальные счета в банках",	"55"],
			["Переводы в пути",	"57"],
			["Финансовые вложения",	"58"],
			["Резервы под обесценение финансовых вложений",	"59"],
			["Расчеты с поставщиками и подрядчиками",	"60"],
			["Расчеты с покупателями и заказчиками",	"62"],
			["Резервы по сомнительным долгам",	"63"],
			["Расчеты по краткосрочным кредитам и займам",	"66"],
			["Расчеты по долгосрочным кредитам и займам",	"67"],
			["Расчеты по налогам и сборам",	"68"],
			["Расчеты по социальному страхованию и обеспечению",	"69"],
			["Расчеты с персоналом по оплате труда",	"70"],
			["Расчеты с подотчетными лицами",	"71"],
			["Расчеты с персоналом по прочим операциям",	"73"],
			["Расчеты с учредителями",	"75"],
			["Расчеты с разными дебиторами и кредиторами",	"76"],
			["Отложенные налоговые обязательства",	"77"],
			["Внутрихозяйственные расчеты",	"79"],
			["Уставный капитал",	"80"],
			["Собственные акции (доли)",	"81"],
			["Резервный капитал",	"82"],
			["Добавочный капитал",	"83"],
			["Нераспределенная прибыль (непокрытый убыток)",	"84"],
			["Целевое финансирование",	"86"],
			["Продажи",	"90"],
			["Прочие доходы и расходы",	"91"],
			["Недостачи и потери от порчи ценностей",	"94"],
			["Резервы предстоящих расходов",	"96"],
			["Расходы будущих периодов",	"97"],
			["Доходы будущих периодов",	"98"],
			["Прибыли и убытки",	"99"]],
  questsToZ: [],
  answer: '',
  maxQests: '',
  maxTime: '',
  currQuest: 15,
  currQData: [],
  currAnsw: '',
  gStarted: false,
  fails: 0,
  text1: 'Buh of Chet',
  qType: 1,
  time: ''
},
methods: {
  startGame: function() {
	this.maxQests = this.maxQests == ''?20:parseInt(this.maxQests);
	if(this.maxQests > this.allQusets.length) {
	  this.maxQests = this.allQusets.length;
	}
	this.currQuest = 1;
	this.fails = 0;
	this.time = this.maxTime == ''?20:parseInt(this.maxTime);
	this.questsToZ = this.allQusets.slice();
	this.questsToZ = this.questsToZ.sort(function(){
	  return Math.random() - 0.5;
	});
	//Меняем у половины ответ с вопросом, помечаем что вопрос типа "2"
	for(i = 0; i < this.questsToZ.length/2; i++) {
	  this.questsToZ[i] = [this.questsToZ[i][1], this.questsToZ[i][0], 2];
	};
	//Перемешаем массив
	this.questsToZ = this.questsToZ.sort(function(){
	  return Math.random() - 0.5;
	});

	//Начинаем игру
	this.gStarted = true;
	//Записываем первое задание
	this.genQuest();
	this.timer();
  },
  pickAnsw: function() {
  	if(this.checkAnsw()) {
  	  this.splashToast("VL-"+this.getRandomInt(1,2), "Верно!");
  	} else {
  	  this.fails++;
  	  this.splashToast("VL-"+this.getRandomInt(1,2)+"-Z", "Не верно!", "Ответ: "+this.currAnsw);
  	}
  	//Проверка условий жизни экзамена
  	if((this.currQuest == this.maxQests) || (this.fails >= 4)) {
  	  this.calculateResult();
      return;
  	}
  	//Новый вопрос
  	this.genQuest();
    this.time = this.maxTime == ''?20:parseInt(this.maxTime);

  	this.answer = '';
  	this.currQuest++;
  },
  timer: function() {
  	if(this.gStarted) {
  	  if(this.time <= 0) {
  		    this.pickAnsw();
  	  } else {
  	     this.time--;
      }

      setTimeout("bg.timer()", 1000);
  	}
  },
  checkAnsw: function() {
	   return this.currAnsw == this.answer.trim();
  },
  genQuest: function() {
  	this.currQData = this.questsToZ.pop();
  	this.currAnsw = this.currQData[1];
  	if(this.currQData[2] == 2) {
  	  this.currQData[1] = [this.currQData[1],
  						  this.allQusets[this.getRandomInt(0,this.allQusets.length-1)][0],
  						  this.allQusets[this.getRandomInt(0,this.allQusets.length-1)][0]];
  	  this.currQData[1] = this.currQData[1].sort(function(){
  		return Math.random() - 0.5;
  	  });
  	  this.qType = 2;
  	} else {
  	  this.qType = 1;
  	}
  	this.text1 = 'Вопрос: '+this.currQData[0];
  },
  calculateResult: function() {
  	if(this.fails >= 4) {
  	  Swal.fire(
  		'Незачёт!',
  		'4 неверных ответа!<br>'+'Правильный ответ: '+this.currAnsw,
  		'error'
  	  );
  	} else {
  	  Swal.fire(
  		'Отлично',
  		'Вы сдали этот зачёт!<br>'+'Правильный ответ: '+this.currAnsw,
  		'success'
  	  );
  	}
  	this.gStarted = false;
  	this.text1 = 'Buh of Chet';
  	this.time = '';
  	return true;
    },
    splashToast: function(imgIndex, text = 'Toast text', addText = '') {
  	Toast.fire({
  	  imageUrl: 'buhgame-assets/'+imgIndex+'.png',
  	  imageWidth: 60,
  	  title: text,
  	  text: addText
  	})
  },
  getRandomInt: function(min, max) {
	   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
});
