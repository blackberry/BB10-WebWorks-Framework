textarea = {
  textarea: null,
  init: function() {
    this.textarea = document.getElementsByTagName('textarea')[0];
    this.textarea.focus();
    this.load();
  },
  load: function() {
    //this.textarea.value = localStorage.getItem('text');
  },
  save: function() {
    //localStorage.setItem('text', this.textarea.value)
  },
  clear: function() {
    this.textarea.value = "";
  },
  append: function(str) {
    this.textarea.value += str + "\n";
  }
}
