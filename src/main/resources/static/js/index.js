
(function() {
  // Shortcut to get elements
  var el = function(element) {
    if (element.charAt(0) === "#") { // If passed an ID...
      return document.querySelector(element); // ... returns single element
    }

    return document.querySelectorAll(element); // Otherwise, returns a nodelist
  };

  // Variables
  var viewer = el("#viewer"), // Calculator screen where result is displayed
    equals = el("#equals"), // Equal button
    stringBut = el("#toString"), //toString button
    historyBut = el("#history"), //History of results button
    nums = el(".num"), // List of numbers
    ops = el(".ops"), // List of operators
    theNum = "", // Current number
    oldNum = "", // First number
    oldNumInt = "",
    resultNum, // Result
    resultString,
    operator; // Operators value
    lessZero = false;

  const plus = (a, b) => a + b;
  const minus = (a, b) => a - b;
  const divided = (a, b) => a / b;
  const times = (a, b) => a * b;
  const power = (a, b) => Math.pow(a,b);
  function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
  }
  function trunk(n) {
      return Math.trunc(n);
    }

  function numberToString(num) {
     const alphabet = "JABCDEFGHI";
     // Split out each digit of the number:
     const digits = Math.floor(num).toString().split("").map(Number);

     // Then create a new string using the alphabet:
     return digits.reduce((str, digit) => {
        return str + alphabet[digit];
     }, "");
  }
  QUnit.module('numberToString', function() {
      QUnit.test('convert numbers to chars in string', function(assert) {
          assert.equal(numberToString(360), "CFJ", '360 => CFJ');
          assert.equal(numberToString(1234567890), "ABCDEFGHIJ", '1234567890 => ABCDEFGHIJ');

        });
      });

  QUnit.module('plus', function() {
      QUnit.test('should plus numbers', function(assert) {
        assert.equal(plus(1,1), 2, '1 + 1 = 2');
        assert.equal(plus(-1,1), 0, '-1 + 1 = 0');
        assert.equal(plus(1.546,0.454), 2, '1.546 + 0.454 = 2');
      });
    });
  QUnit.module('minus', function() {
      QUnit.test('should minus numbers', function(assert) {
        assert.equal(minus(2,1), 1, '2 - 1 = 1');
        assert.equal(minus(-2,1), -3, '- 2 - 1 = -3');
        assert.equal(minus(-2,-1), -1, '- 2 - (- 1) = -1');
      });
    });
  QUnit.module('divided', function() {
        QUnit.test('should divided numbers', function(assert) {
          assert.equal(divided(2,1), 2, '2 / 1 = 2');
          assert.equal(divided(2.25,2), 1.125, '2.25 / 2 = 1.125');
        });
      });
  QUnit.module('times', function() {
          QUnit.test('should times numbers', function(assert) {
            assert.equal(times(2,2), 4, '2 * 2 = 4');
            assert.equal(times(2.25,2), 4.5, '2.25 * 2 = 4.5');
          });
        });
  QUnit.module('power', function() {
            QUnit.test('should power numbers', function(assert) {
              assert.equal(power(2,3), 8, '2 ^ 3 = 8');
            });
          });
  QUnit.module('factorial', function() {
              QUnit.test('should factorial numbers', function(assert) {
                assert.equal(factorial(3), 6, '1 * 2 * 3 = 6');
              });
            });
  QUnit.module('trunk', function() {
                QUnit.test('should power numbers', function(assert) {
                  assert.equal(trunk(3.56), 3, 'trunk(3.56) = 3');
                });
              });

  // When: Number is clicked. Get the current number selected
  var setNum = function() {
    if (resultNum) { // If a result was displayed, reset number
      theNum = this.getAttribute("data-num");
      resultNum = "";
    } else if(this.getAttribute("data-num") != "+/-") { // Otherwise, add digit to previous number (this is a string!)
      theNum += this.getAttribute("data-num");
    }
     else if(this.getAttribute("data-num") == "+/-") {
      lessZero = true;
      theNum = "-" + theNum;
    }
    viewer.innerHTML = theNum; // Display current number
    lessZero = false;
  };

  // When: Operator is clicked. Pass number to oldNum and save operator
  var moveNum = function() {
    oldNum = theNum;
    theNum = "";
    operator = this.getAttribute("data-ops");

    equals.setAttribute("data-result", ""); // Reset result in attr
  };

  // When: Equals is clicked. Calculate result
  var displayNum = function() {
    // Convert string input to numbers
    oldNum = parseFloat(oldNum);
    theNum = parseFloat(theNum);
    // Perform operation
    switch (operator) {
      case "plus":
        resultNum = plus(oldNum,theNum)
        break;

      case "minus":
        resultNum = minus(oldNum,theNum)
        break;

      case "times":
        resultNum = times(oldNum,theNum)
        break;

      case "divided by":
        resultNum = divided(oldNum,theNum)
        break;

      case "power":
        resultNum = power(oldNum,theNum)
        break;

      case "factorial":
        resultNum = factorial(oldNum)
        break;

      case "trunc":
        resultNum = trunk(oldNum)
        break;

        // If equal is pressed without an operator, keep number and continue factorial(theNum)
      default:
        resultNum = theNum;
    }


    // If NaN or Infinity returned
    if (!isFinite(resultNum)) {
      if (isNaN(resultNum)) { // If result is not a number; set off by, eg, double-clicking operators
        resultNum = "Ups...it's broken/try RESET/!";
      } else { // If result is infinity, set off by dividing by zero
        resultNum = "Zero division";
        el('#reset').classList.add("show"); // And show reset button
      }
    }

    // Display result, finally!
    viewer.innerHTML = resultNum;
    equals.setAttribute("data-result", resultNum);

    // Now reset oldNum & keep result
    oldNum = 0;
    theNum = resultNum;
    ajaxPost(resultNum);
  };

  // When: toString is clicked. Display result
  var displayString = function() {
     oldNumInt = parseInt(viewer.innerHTML);
     resultString = numberToString(oldNumInt);
     viewer.innerHTML = resultString;
     ajaxPost(resultString);
  };


  // When: Clear button is pressed. Clear everything
  var clearAll = function() {
    oldNum = "";
    theNum = "";
    viewer.innerHTML = "0";
    equals.setAttribute("data-result", resultNum);

  };

  var getHistory = function() {
          ajaxGet();

      };

  /* The click events */

  // Add click event to numbers
  for (var i = 0, l = nums.length; i < l; i++) {
    nums[i].onclick = setNum;
  }

  // Add click event to operators
  for (var i = 0, l = ops.length; i < l; i++) {
    ops[i].onclick = moveNum;
  }

  // Add click event to equal sign
  equals.onclick = displayNum;
  // toString Button click event
  stringBut.onclick = displayString;
  // History Button click event
  historyBut.onclick = getHistory;

  // Add click event to clear button
  el("#clear").onclick = clearAll;

  // Add click event to reset button
  el("#reset").onclick = function() {
    window.location = window.location;
  };

  /* The click events */

  // AJAX POST Function for write results in memory(DataBase)
    function ajaxPost(resultString){

          // PREPARE FORM DATA
          var formData = {
            resultString :  resultString,

          }

          // DO POST
          $.ajax({
          type : "POST",
          contentType : "application/json",
          url : window.location + "/api/history/save",
          data : JSON.stringify(formData),
          dataType : 'json',
          success : function(result) {
            if(result.status == "Done"){
              $("#postResultDiv").html("<p style='background-color:#7FA7B0; color:white; padding:20px 20px 20px 20px'>" +
                            "Post Successfully! <br>");
            }else{
              $("#postResultDiv").html("<strong>Error</strong>");
            }
            console.log(result);
          },
          error : function(e) {
            alert("Error!")
            console.log("ERROR: ", e);
          }
        });

        };

  // DO GET
  function ajaxGet(){
              $.ajax({
                type : "GET",
                url : window.location + "api/history/all",
                success: function(result){
                  if(result.status == "Done"){
                    $('#getResultDiv ul').empty();
                    var custList = "";
                    $.each(result.data, function(i, history){
                      var history = "id = " + i + ", " + history.resultString + "<br>";
                      $('#getResultDiv .list-group').append(history)
                        });
                    console.log("Success: ", result);
                  }else{
                    $("#getResultDiv").html("<strong>Error</strong>");
                    console.log("Fail: ", result);
                  }
                },
                error : function(e) {
                  $("#getResultDiv").html("<strong>Error</strong>");
                  console.log("ERROR: ", e);
                }
              });
            };

}());

