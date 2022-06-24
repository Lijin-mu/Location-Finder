// Validate Methods
$.validator.addMethod(
  "namefield",
  function (value, element) {
    return this.optional(element) || /^[a-z\'\s]+$/i.test(value);
  },
  "Invalid Characters"
);
$.validator.addMethod(
  "phonefield",
  function (value, element) {
    return this.optional(element) || /^[0-9\+\s]+$/i.test(value);
  },
  "Invalid phone number"
);
$.validator.addMethod(
  "msgfield",
  function (value, element) {
    return this.optional(element) || /^[a-z\0-9\,.'"!()+@\s]+$/i.test(value);
  },
  "Invalid Characters"
);
$.validator.addMethod(
  "email",
  function (value, element) {
    return this.optional(element) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value);
  },
  "Invalid Characters"
);
// $.validator.setDefaults({
//   debug: true,
//   success: "valid"
// });
