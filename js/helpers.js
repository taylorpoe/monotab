// helping out
var h =  {
  gimmeDateString:  function() {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ]

    var date = new Date()
    var day = date.getDate()
    var monthIndex = date.getMonth()
    var year = date.getFullYear()

    return day + ' ' + monthNames[monthIndex] + ' ' + year
  },

  rando: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  },

  gimmeListName: function() {
    var firstWord = ['chamfered', 'holstered', 'bandied', 'cacheted', 'sourced',
      'baked-in', 'sequestered', 'bedeviled', 'abdicated', 'goose-stepped',
      'couched', 'vacuum', 'cadging', 'oblique', 'cordoned', 'nerd', 'known',
      'placated', 'crackling', 'hearty', 'sheathed', 'du jour', 'laissez-faire',
      'kludgy', 'effusive', 'febrile', 'elegaic', 'concussive', 'incontrovertable'
    ]

    var secondWord = ['tacos', , 'modicum', 'walrus', 'fanny pack',
      'fingerstache', 'umami', 'rogan', 'mount', 'rights', 'gills',
      'try', 'sound-box', 'laser-burn', 'belief', 'salad', 'disruption',
      'warrior', 'square', 'salvo', 'sprinkle', 'euthymia', 'fusiform',
      'malaprops', 'curlicues', 'carbuncle', 'gimble', 'flogging',
      'peals', 'goldilocks', 'armpits', 'troglodyte', 'cosmic', 'testbed',
      'kerfuffle', 'curio', 'gubbins', 'constituents', 'geronimo',
      'coquetry', 'dilliance', 'sophist', 'chrysalis', 'vuperdu', 'dossier',
      'welter', 'thrum', 'lunacy', 'truncheon', 'pugs'
    ]

    return this.rando(firstWord) + " " + this.rando(secondWord)
  },

  gimmeShoutOut: function() {
    var phrase = [
      "Go skip some stones in a swimming pool.",
      "People > links. Go hug a person.",
      "You destroyer of worlds.",
      "You warrior, you.",
      "Ka-pow, ka-boom. Axe-kick to the dome.",
      "Time for a taco.",
      "Thank you! XOXO, Your RAM."
    ]

    return this.rando(phrase)
  }
}