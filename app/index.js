'use strict';

var util = require('util'),
  path = require('path'),
  slug = require('slug'),
  yeoman = require('yeoman-generator');


var BespokeGenerator = module.exports = function BespokeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(BespokeGenerator, yeoman.generators.NamedBase);

BespokeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
    "\n" +
    "\noooooooooo.                                          oooo                          o8o          ".cyan.bold +
    "\n`888'   `Y8b                                         `888                          `\"'          ".cyan.bold +
    "\n 888     888  .ooooo.   .oooo.o oo.ooooo.   .ooooo.   888  oooo   .ooooo.         oooo  .oooo.o ".cyan.bold +
    "\n 888oooo888' d88' `88b d88(  \"8  888' `88b d88' `88b  888 .8P'   d88' `88b        `888 d88(  \"8 ".cyan.bold +
    "\n 888    `88b 888ooo888 `\"Y88b.   888   888 888   888  888888.    888ooo888         888 `\"Y88b.  ".cyan.bold +
    "\n 888    .88P 888    .o o.  )88b  888   888 888   888  888 `88b.  888    .o .o.     888 o.  )88b ".cyan.bold +
    "\no888bood8P'  `Y8bod8P' 8\"\"888P'  888bod8P' `Y8bod8P' o888o o888o `Y8bod8P' Y8P     888 8\"\"888P' ".cyan.bold +
    "\n                                 888                                               888          ".cyan.bold +
    "\n                                o888o                                          .o. 88P          ".cyan.bold +
    "\n                                                                               `Y888P           ".cyan.bold +
    "\n" +
    "Thanks for choosing Bespoke.js for your presentation! :)   -@markdalgleish".green.bold +
    "\n";

  console.log(welcome);

  var prompts = [
    {
      name: 'title',
      message: 'What is the title of your presentation?',
      'default': 'Hello World'
    },
    {
      name: 'bullets',
      message: 'Would you like bullet list support?',
      'default': 'Y/n'
    },
    {
      name: 'hash',
      message: 'Would you like hash routing support?',
      'default': 'Y/n'
    },
    {
      name: 'state',
      message: 'Would you slide-specific deck styles?',
      'default': 'Y/n'
    }
  ];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.bullets = (/^y/i).test(props.bullets);
    this.hash = (/^y/i).test(props.hash);
    this.state = (/^y/i).test(props.state);
    this.title = props.title;
    this.shortName = slug(props.title).toLowerCase();

    this.bowerComponentPaths = ['bespoke.js/dist/bespoke.min.js'];
    this.bullets && this.bowerComponentPaths.push('bespoke-bullets/dist/bespoke-bullets.min.js');
    this.hash && this.bowerComponentPaths.push('bespoke-hash/dist/bespoke-hash.min.js');
    this.state && this.bowerComponentPaths.push('bespoke-state/dist/bespoke-state.min.js');

    cb();
  }.bind(this));
};

BespokeGenerator.prototype.projectFiles = function projectFiles() {
  this.template('Gruntfile.js', 'Gruntfile.js');

  this.copy('bowerrc', '.bowerrc');
  this.copy('gitignore', '.gitignore');
  this.copy('jshintrc', '.jshintrc');
}

BespokeGenerator.prototype.packageJson = function packageJson() {
  var packageJson = {
    'name': this.shortName + '-bespoke',
    'version': '0.0.0',
    'dependencies': {
      'grunt': '~0.4.1',
      'grunt-contrib-clean': '~0.4.0',
      'grunt-contrib-copy': '~0.4.1',
      'grunt-contrib-watch': '~0.3.1',
      'grunt-contrib-jade': '~0.5.0',
      'grunt-contrib-stylus': '~0.5.0',
      'grunt-contrib-connect': '~0.3.0',
      'grunt-concurrent': '~0.3.0'
    }
  };
  this.write('package.json', JSON.stringify(packageJson, null, 2));
};

BespokeGenerator.prototype.bowerJson = function bowerJson() {
  var bowerJson = {
    'name': this.shortName + '-bespoke',
    'version': '0.0.0',
    'dependencies': {
      'bespoke.js': '~0.2.0'
    }
  };
  if (this.bullets) bowerJson.dependencies['bespoke-bullets'] = '~0.2.0';
  if (this.hash) bowerJson.dependencies['bespoke-hash'] = '~0.1.0';
  if (this.state) bowerJson.dependencies['bespoke-state'] = '~0.2.0';
  this.write('bower.json', JSON.stringify(bowerJson, null, 2));
};

BespokeGenerator.prototype.plugins = function plugins() {
  var plugins = {};
  if (this.bullets) plugins['bullets'] = 'li';
  if (this.hash) plugins['hash'] = true;
  if (this.state) plugins['state'] = true;
  this.hasPlugins = this.bullets || this.hash || this.state;
  this.pluginsJson = JSON.stringify(plugins, null, 2);
};

BespokeGenerator.prototype.src = function src() {
  this.mkdir('src');
  this.mkdir('src/js');
  this.mkdir('src/css');

  this.template('src/index.jade', 'src/index.jade');
  this.template('src/js/js.js', 'src/js/js.js');
  this.template('src/css/css.styl', 'src/css/css.styl');
};