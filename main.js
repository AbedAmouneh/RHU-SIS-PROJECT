let hasAddedSemester = false;



$("#navLogout").click(function () {
  Cookies.set('username', 'nothing')
});

$("#navClearCookies").click(function () {
  Cookies.set('username', 'nothing')
  Cookies.set('accept', false);
})


let x = Cookies.get('accept');
if (x == 'true') {
  $(".cookies-eu-banner").remove();
}

$("#cookieAccept").click(function () {
  Cookies.set('accept', true);
  $(".cookies-eu-banner").remove();
});
$("#cookieReject").click(function () {
  Cookies.remove('username');
  Cookies.remove('accept');
  window.open('index.html');
})


$(document).ready(function () {
  //Login Page

  if (document.title == "RHU SIS") {
    //if username cookie isnt null go quickly to homepage
    let x = Cookies.get("username");
    if (Cookies.get("username") != "nothing" && Cookies.get("username") != null) {
      window.location.assign("homepage.html");
    }

    hasBeenWrong = false; //variable to determine whether or not to remove past mistakes that are red
    let btnLogin = document.getElementById("btnLogin");
    let passwordInput = document.getElementById("txtLoginPassword");
    let usernameInput = document.getElementById("txtLoginUsername");
    let text = document.getElementById("text");


    //when enter is pressed
    $(document).on('keypress', function (e) {
      if (e.which == 13) {
        $(btnLogin).trigger('click');
      }
    });

    passwordInput.addEventListener("keyup", function (event) {

      // If "caps lock" is pressed, display the warning text
      if (event.getModifierState("CapsLock")) {
        text.style.display = "block";
      } else {
        text.style.display = "none"
      }
    });

    usernameInput.addEventListener("keyup", function (event) {

      // If "caps lock" is pressed, display the warning text
      if (event.getModifierState("CapsLock")) {
        text.style.display = "block";
      } else {
        text.style.display = "none"
      }
    });
    let countJsonObjects = 0;

    btnLogin.addEventListener("click", function () {
      let divLoginDesignHeader = document.getElementById("loginDesignHeader");
      if (hasBeenWrong == true) {
        divLoginDesignHeader.removeChild(divLoginDesignHeader.lastChild);
      }
      hasBeenWrong = false;
      let username = document.getElementById("txtLoginUsername").value;
      let password = document.getElementById("txtLoginPassword").value;

      fetch("users.json")
        .then((response) => response.json())
        .then((data) => {
          let hasFound = false;

          data.forEach((item) => {

            if (hasFound) {
              //dont do anything!!!!
            }
            else {
              if (item.ID == username && item.Password == password) {
                window.open("homepage.html?ID=" + username, "_self");
                Cookies.set('username', username, { expires: 7 })
                hasFound = true;
              }
              else if ((username == "" || password == "") && !hasFound) {
                let divLoginDesignHeader = document.getElementById("loginDesignHeader");
                if (hasBeenWrong == true) {
                  divLoginDesignHeader.removeChild(divLoginDesignHeader.lastChild);
                }
                let txt = document.createElement("p");
                txt.innerHTML = "Please make sure both fields are filled!";
                divLoginDesignHeader.appendChild(txt);
                hasBeenWrong = true;
              }
              else if ((username == "" && password != "")) {
                let divLoginDesignHeader = document.getElementById("loginDesignHeader");
                if (hasBeenWrong == true) {
                  divLoginDesignHeader.removeChild(divLoginDesignHeader.lastChild);
                }
                //this is not working ~Abed ~~~~~~~~
                let txt = document.createElement("p");
                txt.innerHTML = "Invalid username or password! Please try again";
                divLoginDesignHeader.appendChild(txt);
                hasBeenWrong = true;
              }
              else if ((username == item.ID && item.Password != password)) {
                let divLoginDesignHeader = document.getElementById("loginDesignHeader");
                if (hasBeenWrong == true) {
                  divLoginDesignHeader.removeChild(divLoginDesignHeader.lastChild);
                }
                let txt = document.createElement("p");
                txt.innerHTML = "Invalid username or password! Please try again";
                divLoginDesignHeader.appendChild(txt);
                hasBeenWrong = true;
              }
            }
            countJsonObjects++;
          });
          if (!hasBeenWrong && !hasFound) {
            let divLoginDesignHeader = document.getElementById("loginDesignHeader");
            if (hasBeenWrong == true) {
              divLoginDesignHeader.removeChild(divLoginDesignHeader.lastChild);
            }
            let txt = document.createElement("p");
            txt.innerHTML = "No one with that username exists!";
            divLoginDesignHeader.appendChild(txt);
            hasBeenWrong = true;
          }
        });
    }

    );
  } else if (document.title == "Study Plan") {

    let globalUsername = Cookies.get('username');
    let savedIndex = 0;
    let savedIndexSaved = 0;

    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
          }
        });
      });

    //fetch user info
    fetch("studyplan.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            savedIndexSaved = savedIndex;
            return;
          }
          else {

            savedIndex++;
          }
        });
      });


    let arrTaken = [];
    let i = 0, turn = 0;

    fetch("studyplan.json")
      .then((response) => response.json())
      .then((data) => {
        const tbody = document.querySelector("#studyplantable tbody");
        $.each(data[savedIndexSaved].StudyPlan, function (index, item) {
          const row = document.createElement("tr");
          //data-toggle='tooltip' data-placement='top' title='Today'
          $(row).prop("toggle", "tooltip");
          $(row).prop("data-placement", "top");
          $(row).prop("title", item.description);
          const courseCell = document.createElement("td");
          const titleCell = document.createElement("td");
          const creditCell = document.createElement("td");
          const PrerequisitesCell = document.createElement("td");

          courseCell.textContent = item.Coursecode;

          titleCell.textContent = item.Title;
          creditCell.textContent = item.Credits;
          PrerequisitesCell.textContent = item.Prerequisites;
          arrTaken[item] = item.taken;

          row.appendChild(courseCell);

          row.appendChild(titleCell);
          row.appendChild(creditCell);
          row.appendChild(PrerequisitesCell);
          $(row).append('<td><p class="checkboxstudyplan"></p></td>');

          tbody.appendChild(row);
          $(".checkboxstudyplan").attr("disabled", true);
          if (item.taken == 1) {
            $(".checkboxstudyplan").eq(i).html("&#x2713;");
          }
          i++;
          //if its a semester
          let blabla = item.Coursecode;
          if (blabla.includes("emester") || blabla.includes("ession")) {
            $(row).css("background-color", "rgb(140, 106, 135)");
            $(row).css("color", "white");
            turn = 0;
          }
          else {
            if (turn == 0) {
              turn = 1;
            }
            else if (turn == 1) {
              turn = 0;
              $(row).css("background-color", "#eaeaea");
            }
          }
        });
      });



    // fetch("studyplan.json")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const tbody = document.querySelector("#studyplantable tbody");

    //     data.forEach((item) => {
    //       const row = document.createElement("tr");
    //       //data-toggle='tooltip' data-placement='top' title='Today'
    //       $(row).prop("toggle", "tooltip");
    //       $(row).prop("data-placement", "top");
    //       $(row).prop("title", item.description);
    //       const courseCell = document.createElement("td");
    //       const titleCell = document.createElement("td");
    //       const creditCell = document.createElement("td");
    //       const PrerequisitesCell = document.createElement("td");

    //       courseCell.textContent = item.Coursecode;

    //       titleCell.textContent = item.Title;
    //       creditCell.textContent = item.Credits;
    //       PrerequisitesCell.textContent = item.Prerequisites;
    //       arrTaken[item] = item.taken;

    //       row.appendChild(courseCell);

    //       row.appendChild(titleCell);
    //       row.appendChild(creditCell);
    //       row.appendChild(PrerequisitesCell);
    //       $(row).append('<td><p class="checkboxstudyplan"></p></td>');

    //       tbody.appendChild(row);
    //       $(".checkboxstudyplan").attr("disabled", true);
    //       if (item.taken == 1) {
    //         $(".checkboxstudyplan").eq(i).html("&#x2713;");
    //       }
    //       i++;

    //       //if its a semester
    //       let blabla = item.Coursecode;
    //       if (blabla.includes("emester") || blabla.includes("ession")) {
    //         $(row).css("background-color", "rgb(140, 106, 135)");
    //         $(row).css("color", "white");
    //         turn = 0;
    //       }

    //       else {
    //         if (turn == 0) {
    //           turn = 1;
    //         }
    //         else if (turn == 1) {
    //           turn = 0;
    //           $(row).css("background-color", "#eaeaea");
    //         }
    //       }

    //     });
    //   });
  } else if (document.title == "Profile") {


    let nbrCompletedCredits = 0, nbrTotalCredits = 0;
    let globalUsername = Cookies.get('username');
    let savedIndex = 0;
    let savedIndexSaved = 0;

    //fetch user info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          let x = item.ID
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
            savedIndexSaved = savedIndex;
            return;
          } else {
            savedIndex++;
          }
        });
      });


    //fetch schedule info
    //Yes i am aware this can be done in a significantly easier and cleaner way
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            //declare time slot arrays of each day 
            arrMonday = [];
            arrMondayNames = [];
            let M = 0;
            //arrmondaynames
            arrTuesday = [];
            arrTuesdayNames = [];
            let T = 0;

            arrWednesday = [];
            arrWednesdayNames = [];
            let W = 0;

            arrThursday = [];
            arrThursdayNames = [];
            let R = 0;

            arrFriday = [];
            arrFridayNames = [];
            let F = 0;

            //fill in the information about starttimes and end times in the array
            item.CurrentCourses.forEach((nestedItem) => {
              if (nestedItem.Days.includes("M")) {
                arrMonday[M] = nestedItem.StartTime;
                arrMondayNames[M] = nestedItem.CourseName;
                M++;
                arrMonday[M] = nestedItem.EndTime;
                arrMondayNames[M] = nestedItem.CourseName;
                M++;
              }
              if (nestedItem.Days.includes("W")) {
                arrWednesday[W] = nestedItem.StartTime;
                arrWednesdayNames[W] = nestedItem.CourseName;
                W++;
                arrWednesday[W] = nestedItem.EndTime;
                arrWednesdayNames[W] = nestedItem.CourseName;
                W++;
              }
              if (nestedItem.Days.includes("T")) {
                arrTuesday[T] = nestedItem.StartTime;
                arrTuesdayNames[T] = nestedItem.CourseName
                T++;
                arrTuesday[T] = nestedItem.EndTime;
                arrTuesdayNames[T] = nestedItem.CourseName;
                T++;
              }
              if (nestedItem.Days.includes("R")) {
                arrThursday[R] = nestedItem.StartTime;
                arrThursdayNames[R] = nestedItem.CourseName;
                R++;
                arrThursday[R] = nestedItem.EndTime;
                arrThursdayNames[R] = nestedItem.CourseName;
                R++;
              }
              if (nestedItem.Days.includes("F")) {
                arrFriday[F] = nestedItem.StartTime;
                arrFridayNames[F] = nestedItem.CourseName;
                F++;
                arrFriday[F] = nestedItem.EndTime;
                arrFridayNames[F] = nestedItem.CourseName;
                F++;
              }

            });

            let namesIndex = 0;
            //fill in the arr information in a weekly schedule table
            for (let i = 0; i < arrMonday.length; i++) {
              let xStart = arrMonday[i].charAt(0) + arrMonday[i].charAt(1);
              let xEnd = arrMonday[i].charAt(3) + arrMonday[i].charAt(4);
              $("#profileTBody tr td:nth-child(2)").each(function (index) {
                if ($(this).parent().children().eq(0).html() == arrMonday[i] || $(this).parent().children().eq(0).html().includes(xStart)) {
                  $(this).parent().children().eq(1).css("background-color", "#add8e6");
                  let x = $(this).parent().children().eq(1).children(1).eq(1).html();
                  if (x != arrMondayNames[namesIndex])
                    $(this).parent().children().eq(1).children().eq(1).html(x + " " + arrMondayNames[namesIndex]);
                  namesIndex++;
                }
              })

            }

            namesIndex = 0;
            //fill in the arr information in a weekly schedule table
            for (let i = 0; i < arrTuesday.length; i++) {
              let xStart = arrTuesday[i].charAt(0) + arrTuesday[i].charAt(1);
              let xEnd = arrTuesday[i].charAt(3) + arrTuesday[i].charAt(4);

              $("#profileTBody tr td:nth-child(3)").each(function (index) {
                if ($(this).parent().children().eq(0).html() == arrTuesday[i] || $(this).parent().children().eq(0).html().includes(xStart)) {
                  $(this).parent().children().eq(2).css("background-color", "#f9f777");
                  let x = $(this).parent().children().eq(2).children(1).eq(1).html();
                  if (x != arrTuesdayNames[namesIndex])
                    $(this).parent().children().eq(2).children().eq(1).html(x + " " + arrTuesdayNames[namesIndex]);
                  namesIndex++;
                }
              })
            }

            namesIndex = 0;
            for (let i = 0; i < arrWednesday.length; i++) {
              let xStart = arrWednesday[i].charAt(0) + arrWednesday[i].charAt(1);
              let xEnd = arrWednesday[i].charAt(3) + arrWednesday[i].charAt(4);

              $("#profileTBody tr td:nth-child(4)").each(function (index) {
                if ($(this).parent().children().eq(0).html() == arrWednesday[i] || $(this).parent().children().eq(0).html().includes(xStart)) {
                  $(this).parent().children().eq(3).css("background-color", "#add8e6");
                  let x = $(this).parent().children().eq(3).children(1).eq(1).html();
                  if (x != arrWednesdayNames[namesIndex])
                    $(this).parent().children().eq(3).children().eq(1).html(x + " " + arrWednesdayNames[namesIndex]);
                  namesIndex++;
                }
              })
            }

            namesIndex = 0;
            for (let i = 0; i < arrThursday.length; i++) {
              let xStart = arrThursday[i].charAt(0) + arrThursday[i].charAt(1);
              let xEnd = arrThursday[i].charAt(3) + arrThursday[i].charAt(4);

              $("#profileTBody tr td:nth-child(5)").each(function (index) {
                if ($(this).parent().children().eq(0).html() == arrThursday[i] || $(this).parent().children().eq(0).html().includes(xStart)) {
                  $(this).parent().children().eq(4).css("background-color", "#f9f777");
                  let x = $(this).parent().children().eq(4).children(1).eq(1).html();
                  if (x != arrThursdayNames[namesIndex])
                    $(this).parent().children().eq(4).children().eq(1).html(x + " " + arrThursdayNames[namesIndex]);
                  namesIndex++;
                  
                }
              })
            }

            namesIndex = 0;
            for (let i = 0; i < arrFriday.length; i++) {
              let xStart = arrFriday[i].charAt(0) + arrFriday[i].charAt(1);
              let xEnd = arrFriday[i].charAt(3) + arrFriday[i].charAt(4);

              $("#profileTBody tr td:nth-child(6)").each(function (index) {
                if ($(this).parent().children().eq(0).html() == arrFriday[i] || $(this).parent().children().eq(0).html().includes(xStart)) {
                  $(this).parent().children().eq(5).css("background-color", "#f9f777");
                  let x = $(this).parent().children().eq(2).children(1).eq(1).html();
                  if (x != arrFridayNames[namesIndex])
                    $(this).parent().children().eq(5).children().eq(1).html(x + " " + arrFridayNames[namesIndex]);
                  namesIndex++;
                }
              })
            }

          }
        });
      });


    //fetch user info once again because Im scared of that return code at line 284 :P
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#profilePFP").attr("src", item.Picture);
            $("#profileSecondaryContainer .classicArticle:first-child h4").html(item.ID);
            $("#profileSecondaryContainer > article:nth-child(1) > p:nth-child(3)").html(item.Name);
            $("#profileSecondaryContainer > article:nth-child(1) > p:nth-child(4)").html(item.Major);
            $("#profileSecondaryContainer > article:nth-child(1) > p:nth-child(5)").html(item.Department);
            $("#profileSecondaryContainer > article:nth-child(1) > p:nth-child(6)").html(item.College);

            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(2) > p").html(item.ID);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(3) > p").html(item.FirstName);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(4) > p").html(item.MiddleName);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(5) > p").html(item.LastName);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(6) > p").html(item.Nationality);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(7) > p").html(item.Address);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(8) > p").html(item.Email);
            $("#profileSecondaryContainer > article:nth-child(2) > div:nth-child(9) > p").html(item.Phone);

            $("#profileCardDeck > div:nth-child(1) > div > p:nth-child(2)").html(item.Status);
            $("#profileCardDeck > div:nth-child(2) > div > p:nth-child(2)").html(item.CurrentCredits);
            $("#profileCardDeck > div:nth-child(3) > div > p:nth-child(2)").html(parseInt(item.NeededCredits) - parseInt(item.CompletedCredits));
            $("#profileCardDeck > div:nth-child(4) > div > p:nth-child(2)").html(parseFloat(item.CGPA));

            nbrCompletedCredits = item.CompletedCredits;
            nbrTotalCredits = item.NeededCredits;

            //Progress bar code

            let progress = parseFloat(nbrCompletedCredits) * 100;
            progress = parseFloat(progress) / parseFloat(nbrTotalCredits);
            $("#profileProgressBar > div > span").attr("data-progress", parseInt(progress));
            $(".animated-progress span").each(function () {
              $(this).animate(
                {
                  width: $(this).attr("data-progress") + "%",
                },
                2000
              );
              $(this).text($(this).attr("data-progress") + "%");
            });
            $("#profileProgresBarExplanation").html("You have finished " + nbrCompletedCredits + " credits out of " + nbrTotalCredits);

          }

        });
      });



    //fetch gpa info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {

        $.each(data[savedIndexSaved].Grades, function (index, term) {
          $("#gpaGradeSelect").append("<option>" + term.Name + "</option>")
          $.each(term.Courses, function (index, course) {
            //cursed code, better come back to fix this later
          });
        });

        loadGpaTablesProfile(savedIndexSaved);
      });

  } else if (document.title == "Homepage") {
    let globalUsername = Cookies.get('username');
    //calendar code
    let month = 3; //march
    let year = 2023;

    loadCalendar(month, year, "right");

    $(".prev").click(function () {
      if (month === 0) {
        month = 11;
        year--;
      }
      else {
        month--;
      }
      loadCalendar(month, year, "left");
      $("#homepageUpcomingEvents p").each(function () {
        if ($(this).attr("id") != "homepageTimeline")
          $(this).remove();
      })

    });

    $('.next').on('click', function () {
      if (month === 11) {
        month = 0;
        year++;
      } else {
        month++;
      }
      loadCalendar(month, year, "right");
      $("#homepageUpcomingEvents p").each(function () {
        if ($(this).attr("id") != "homepageTimeline")
          $(this).remove();
      })
    });

    //edit user information in homepage 
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
            $(".profileimg").attr("src", item.Picture);
            $(".profileimg").attr("alt", "RHU Student");
            $("#homepageProfileFirstP").html(item.Name);
            $(".homepageProfile p:nth-child(3)").html(item.ID);
            $(".homepageProfile p:nth-child(4)").html(item.Major);
            $(".homepageProfile p:nth-child(5)").html(item.CGPA);
            $("#homepageProgressCredits>div>p").html(item.CompletedCredits);
            $("#homepageProgressCredits>p").html(item.NeededCredits);
            let percentage = (parseFloat(item.CompletedCredits) / parseFloat(item.NeededCredits)) * 100;
            $("#homepageProgressCredits>div").css("width", percentage + "%");
          }

        });
      });


    //homepage slideshow code to make it transition
    $(".carousel").carousel({
      interval: 3500,
    });

    let btnOne = $("#homepagebtnOne");
    let btnTwo = $("#homepagebtnTwo");
    let btnThree = $("#homepagebtnThree");

    btnOne.click(function () {
      $(".cardFirst").each(function (i) {
        $(this).removeClass("homepageHidden");
        $(this).addClass("animatedCardEnterFromRight");
      });

      $(".cardSecond").each(function (i) {
        $(this).addClass("homepageHidden");
      });

      $(".cardThird").each(function (i) {
        $(this).addClass("homepageHidden");
      });

      btnOne.addClass("homepageActivated");
      btnTwo.removeClass("homepageActivated");
      btnThree.removeClass("homepageActivated");
    });


    btnTwo.click(function () {

      $(".cardSecond").each(function (i) {
        $(this).removeClass("homepageHidden");
        if (btnOne.hasClass("homepageActivated")) {
          $(this).removeClass("animatedCardEnterFromRight");
          $(this).addClass("babjunga");
        }
        else if (btnThree.hasClass("homepageActivated")) {
          $(this).removeClass("animatedCardEnterFromRight");
          $(this).removeClass("animatedCardEnterFromLeft");
          $(this).addClass("animatedCardEnterFromRight");
        }
      });

      $(".cardFirst").each(function (i) {
        $(this).addClass("homepageHidden");
      });

      $(".cardThird").each(function i() {
        $(this).addClass("homepageHidden");
      });

      btnOne.removeClass("homepageActivated");
      btnTwo.addClass("homepageActivated");
      btnThree.removeClass("homepageActivated");
    });

    btnThree.click(function () {
      $(".cardSecond").each(function (i) {
        $(this).addClass("homepageHidden");
      });

      $(".cardFirst").each(function (i) {
        $(this).addClass("homepageHidden");
      });

      $(".cardThird").each(function i() {
        $(this).removeClass("homepageHidden");
        //dont ask
        $(this).addClass("babjunga");
      });

      btnOne.removeClass("homepageActivated");
      btnTwo.removeClass("homepageActivated");
      btnThree.addClass("homepageActivated");
    });
  } else if (document.title == "Course Registration") {
    let globalUsername = Cookies.get('username');

    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
          }
        });
      });
    loadCourses();
    ////////just here to fill in the space :P
  }
  else if (document.title == "Academic Forms") {
    let globalUsername = Cookies.get('username');

    //fetch user info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
            return;
          }
        });
      });
  }
  else if (document.title == "Contact Us") {
    let globalUsername = Cookies.get('username');

    //fetch user info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
            return;
          }
        });
      });
  }
  else if (document.title == "GPA") {
    let globalUsername = Cookies.get('username');
    let savedIndex = 0;
    let savedIndexSaved = 0;

    //fetch user info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            $("#pleaseSTOP").attr("src", item.Picture);
            savedIndexSaved = savedIndex
            return;
          }
          else {
            savedIndex++;
          }
        });
      });

    //fetch gpa info
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {

        $.each(data[savedIndexSaved].Grades, function (index, term) {
          $("#gpaGradeSelect").append("<option>" + term.Name + "</option>")
          $.each(term.Courses, function (index, course) {
            //cursed code, better come back to fix this later
          });
        });



        loadGpaTables(savedIndexSaved);
      });
  }

});



function loadCalendar(month, year, direction) {
  $(".homepageDays").empty();
  $('#monthYear').text(getMonthName(month) + '\n' + year);
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDayOfMonth = new Date(year, month, 1).getDay();
  for (var i = 1; i < firstDayOfMonth; i++) {
    $('.homepageDays').append('<li style="color:lightgray; margin-right:1.85%;"></li>');
  }
  for (var day = 1; day <= daysInMonth; day++) {
    let today = new Date();
    let isToday = (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day);

    let dayHTML = '<li ';
    if (direction == "right") {
      dayHTML += "class='animatedLiEnterFromLeft";
    }
    else {
      dayHTML += "class='animatedLiEnterFromRight";
    }
    if (isToday) {
      dayHTML += " todayActive active' data-toggle='tooltip' data-placement='top' title='Today' ";
    }
    dayHTML += "'>" + day + "</li > ";
    $(".homepageDays").append(dayHTML);

    // if (isToday) {
    //   dayHTML += ' class="todayActive active"';
    // } else if (event) {
    //   dayHTML += ' class="active" data-toggle="tooltip" data-placement="top" ';
    // }
  }
  loadCalendarJsonData(month, year, direction);
}



function loadCalendarJsonData(month, year, direction) {
  month++;
  let count = 0;
  month = 0 + month;
  fetch("events.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        let itemDate = item.Date;
        //get month of each json data
        let itemMonth = itemDate.charAt(3) + itemDate.charAt(4);
        //get year of each json data
        let itemYear = itemDate.charAt(6) + itemDate.charAt(7) + itemDate.charAt(8) + itemDate.charAt(9);

        if (itemMonth == month && itemYear == year) {
          //get day of json data that is equivalent to the month and year parameters
          let itemDay = itemDate.charAt(0) + itemDate.charAt(1);
          $(".homepageDays li").each(function () {
            //did this to get rid of the 0 in front of the numbers
            itemDay = parseInt(itemDay) + 10;
            itemDay = parseInt(itemDay) - 10;
            if ($(this).html() == itemDay) {
              $(this).addClass("active");
              $(this).attr('data-toggle', 'tooltip');
              $(this).attr('data-placement', 'top');
              $(this).attr('title', item.Description);
            }
          })

          let today = new Date();
          //getMonth starts with index 0!?!
          if (itemDay > today.getDate() && itemMonth >= today.getMonth() + 1) {
            itemMonth = parseInt(itemMonth) + 10;
            itemMonth = parseInt(itemMonth) - 10;
            itemMonth = parseInt(itemMonth) - 1;
            $("#homepageUpcomingEvents").append("<p class='animatedFadeIn'><b>" + getMonthName(itemMonth) + " " + itemDay + ": </b>" + item.Description + "</p>");

          }

          // console.log(parseInt(today.getMonth()) +">"+ parseInt(itemMonth))
          // if (parseInt(today.getMonth()) >= parseInt(itemMonth)) {
          //   if(count==1){
          //     $("#homepageUpcomingEvents").append("<p class='animatedFadeIn'>There are no upcoming events this month</p>");
          //     count++;
          //   }
          // }
        }
      });


      $("#homepageUpcomingEvents>p").each(function () {
        count++;
      });
      if (count == 1) {
        $("#homepageUpcomingEvents").append("<p class='animatedFadeIn'>There are no upcoming events this month</p>");
        count++;
      }
    });


}

function getMonthName(month) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month];
}


/*Functions for GPA Calculator*/

function loadGpaTables(savedIndex) {
  let blabla = 0;

  //append a grades table
  fetch("users.json")
    .then((response) => response.json())
    .then((data) => {
      $.each(data[savedIndex].Grades, function (index, term) {
        $("#gpaGrades").append('<div class="gpaGradeTableContainer table-responsive"><table class="table" id="gpaGradesTable"><thead><tr><th scope="col">Course Title</th><th scope="col">Credits</th><th scope="col">Pass</th><th scope="col">Grade</th><th scope="col">Letter Grade</th></tr></thead><tbody></tbody></table><div class="gpaGradeTableGrades"></div></div>');
        $.each(term.Courses, function (index, course) {
          let x = $("#gpaGrades").children().eq(blabla + 2).children().eq(0).children().eq(1);
          $("#gpaGrades").children().eq(blabla + 2).children().eq(0).children().eq(1).append('<tr><td data-toggle="tooltip" data-placement="top" title="' + course["Course Description"] + '"style="cursor:help;">' + course.CourseName + '</td><td>' + course.Credit + '</td><td>' + course.Pass + '</td><td>' + course.Grade + '</td><td>' + course.LetterGrade + '</td></tr>');
        });
        $("#gpaGrades").children().eq(blabla + 2).children().eq(1).append('<p><b>Term GPA: </b>' + term.TermGpa + '</p>');
        $("#gpaGrades").children().eq(blabla + 2).children().eq(1).append('<p><b>Cumulative GPA: </b>' + term.CumGpa + '</p>')
        blabla++;
      });
      getGrades();
    });
}



function getGrades() {
  let x = $("#gpaGradeSelect").prop('selectedIndex');
  $(".gpaGradeTableContainer").each(function () {
    $(this).addClass("hidden");
  })
  $("#gpaGrades").children().eq(x + 2).removeClass("hidden");
}

function addSemester() {
  if ($("#articleCalculator .gpaOneSemester").length > 21) {
    alert("Unable to add more than 21 semesters!");
    return;
  }

  if (hasAddedSemester == false) {
    $("#articleCalculator").append(
      '<div class="gpaOneSemester"> <div class="gpaSemesterHeader"> <h3>Semester</h3> <div class="gpaSemesterHeaderControls"> <button onclick="addSemester()">+</button> <button onclick="removeSemester(this)">X</button> </div> </div> <div class="gpaSemesterInputs"> <div class="gpaSemesterInputsLine"> <div class="gpaSemesterInputsLineOneObject"> <h5>Grade </h5> <input type="number" name="" id="gpaInputGrade" min="0" max="100"> </div> <div class="gpaSemesterInputsLineOneObject"> <h5>Credits </h5> <input type="number" name="" id="gpaInputCredit" min="1" max="4"> </div> <div class="gpaSemesterInputsLineControls"> <button onclick="addLine(this)">+</button> <button onclick="removeLine(this)">X</button> </div> </div> </div> <div class="gpaSemesterFooter"> <button onclick="calculateSemesterGPA(this)">Calculate</button> <h5 class="gpaAnswer">00.00</h5> </div> </div>'
    );
    $("#articleCalculator").append(
      '<div class="gpaCalculatorFooter"><button onclick="calculatorOverallGPA(this)" id="btnOverallGPA">Calculate CGPA</button><h5 id="overallGPA">00.00</h5></div>'
    );
    hasAddedSemester = true;
  } else {
    $("#articleCalculator div:last").before(
      '<div class="gpaOneSemester"> <div class="gpaSemesterHeader"> <h3>Semester</h3> <div class="gpaSemesterHeaderControls"> <button onclick="addSemester()">+</button> <button onclick="removeSemester(this)">X</button> </div> </div> <div class="gpaSemesterInputs"> <div class="gpaSemesterInputsLine"> <div class="gpaSemesterInputsLineOneObject"> <h5>Grade </h5> <input type="number" name="" id="gpaInputGrade" min="0" max="100"> </div> <div class="gpaSemesterInputsLineOneObject"> <h5>Credits </h5> <input type="number" name="" id="gpaInputCredit" min="1" max="4"> </div> <div class="gpaSemesterInputsLineControls"> <button onclick="addLine(this)">+</button> <button onclick="removeLine(this)">X</button> </div> </div> </div> <div class="gpaSemesterFooter"> <button onclick="calculateSemesterGPA(this)">Calculate</button> <h5 class="gpaAnswer">00.00</h5> </div> </div>'
    );
  }
}

function removeSemester(el) {
  allSemesters = $("#articleCalculator")
    .find('[class="gpaOneSemester"]')
    .toArray();
  if (allSemesters.length == 1) {
    return;
  }
  if (allSemesters.length == 2) {
    hasAddedSemester = false;
    $("#articleCalculator div:last").remove();
  }
  $(el).parent().parent().parent().remove();
}

function addLine(el) {
  $(el)
    .parent()
    .parent()
    .parent()
    .append(
      '<div class="gpaSemesterInputsLine"> <div class="gpaSemesterInputsLineOneObject"> <h5>Grade </h5> <input type="number" name="" id="gpaInputGrade" min="0" max="100"> </div> <div class="gpaSemesterInputsLineOneObject"> <h5>Credits </h5> <input type="number" name="" id="gpaInputCredit" min="1" max="4"> </div> <div class="gpaSemesterInputsLineControls"> <button onclick="addLine(this)">+</button> <button onclick="removeLine(this)">X</button> </div> </div>'
    );
  if ($(el).parent().parent().parent().children().length > 21)
    alert("Unable to add more than 21 courses for a single semester!");
}

function removeLine(el) {
  if ($(el).parent().parent().parent().children().length == 1) {
    return;
  }
  $(el).parent().parent().remove();
}

function calculateSemesterGPA(el) {
  let hasCrashed = false;
  let answer = 0;
  let children = $(el).parent().parent().children(); //get parent gpaOneSemester
  let gpaSemesterInputs = children[1]; //get gpaSemesterInputs
  //let grades = $(gpaSemesterInputs).find('#gpaInputGrade').toArray();
  grades = $(gpaSemesterInputs).find('[id="gpaInputGrade"]').toArray();
  credits = $(gpaSemesterInputs).find('[id="gpaInputCredit"]').toArray();

  let realGrades = [];
  $(grades).each(function (i) {
    if (
      $.isNumeric($(this).val()) == false ||
      $(grades[i]).val() < 0 ||
      $(grades[i]).val() > 100
    ) {
      alert(
        "Please fill in all the grades of the semester you are calculating correctly"
      );
      hasCrashed = true;
      return false;
    }
    if (
      $.isNumeric($(credits[i]).val()) == false ||
      $(credits[i]) < 1 ||
      $(credits[i]) > 5
    ) {
      alert(
        "Please fill in all the credits of the semester you are calculating correctly"
      );
      hasCrashed = true;
      return false;
    }

    if ($(credits[i]).val() == 1) realGrades[i] = $(grades[i]).val() * 0.33;
    else if ($(credits[i]).val() == 2)
      realGrades[i] = $(grades[i]).val() * 0.66;
    else if ($(credits[i]).val() == 3) realGrades[i] = $(grades[i]).val();
    else if ($(credits[i]).val() == 4)
      realGrades[i] = $(grades[i]).val() * 1.33;
    else if ($(credits[i]).val() == 5)
      realGrades[i] = $(grades[i]).val() * 1.66;
  });

  if (hasCrashed == true) return true;
  let sumGrades = 0,
    sumCredits = 0;

  for (var i = 0; i < grades.length; i++) {
    let x = sumGrades;
    sumGrades = parseFloat(x) + parseFloat(realGrades[i]);
    sumCredits = parseFloat(sumCredits) + parseFloat($(credits[i]).val());
  }

  let divisor = parseFloat(sumCredits) * 33.33;
  answer = (parseFloat(sumGrades) / divisor) * 100;

  $(el)
    .parent()
    .parent()
    .children()
    .find('[class="gpaAnswer"]')
    .html(parseFloat(answer).toFixed(2));
}

function calculatorOverallGPA(el) {
  let hasCrashed = false;

  let x = $(el).parent().parent().find('[class="gpaOneSemester"]').toArray();
  let sumCreditsAll = 0,
    sumGPA = 0;

  for (let i = 0; i < x.length; i++) {
    let sumGrades = 0,
      sumCredits = 0;
    let realGrades = [];
    let grades = $(x[i]).find('[id="gpaInputGrade"]').toArray();
    let credits = $(x[i]).find('[id="gpaInputCredit"]').toArray();

    for (let j = 0; j < grades.length; j++) {
      //Loop over every grade and add that grade+credit to their respective sums
      if (
        $.isNumeric($(grades[j]).val()) == false ||
        $(grades[j]).val() < 0 ||
        $(grades[j]).val() > 100
      ) {
        //check if any boxes are empty
        alert(
          "Please fill in all the grades of the semester you are calculating correctly"
        );
        hasCrashed = true;
        return false;
      }
      if (
        $.isNumeric($(credits[j]).val()) == false ||
        $(credits[j]) < 1 ||
        $(credits[j]) > 5
      ) {
        //check if any boxes are empty
        alert(
          "Please fill in all the credits of the semester you are calculating correctly"
        );
        hasCrashed = true;
        return false;
      }

      if ($(credits[j]).val() == 1) realGrades[j] = $(grades[j]).val() * 0.33;
      else if ($(credits[j]).val() == 2)
        realGrades[j] = $(grades[j]).val() * 0.66;
      else if ($(credits[j]).val() == 3) realGrades[j] = $(grades[j]).val();
      else if ($(credits[j]).val() == 4)
        realGrades[j] = $(grades[j]).val() * 1.33;
      else if ($(credits[j]) == 5) realGrades[j] = $(grades[j]).val() * 0.166;

      sumGrades = parseFloat(sumGrades) + parseFloat(realGrades[j]);
      sumCredits = parseFloat(sumCredits) + parseFloat($(credits[j]).val());
    }

    //add sumcreditsall and sumgpa to the sumGrades and sumcredits which are local to each gpaOneSemester
    sumCreditsAll = parseFloat(sumCreditsAll) + parseFloat(sumCredits);
    sumGPA = parseFloat(sumGPA) + parseFloat(sumGrades);
  }
  let answer = (parseFloat(sumGPA) / (parseFloat(sumCreditsAll) * 33.33)) * 100;
  $(el)
    .parent()
    .parent()
    .find('[id="overallGPA"]')
    .html(parseFloat(answer).toFixed(2));
}

/*Course registration functions*/
//Yes I am aware of how badly repetitive the following code is, but its currently 3:00 am and I am at wits end

function search(el) {
  let searchString = $(el)
    .parent()
    .parent()
    .find('[class="form-control"]')
    .val()
    .toUpperCase();
  let hiddenRowCount = 0,
    rowCount = 0;
  let arr = [],
    o = 0,
    arr1 = [],
    o1 = 0;

  if (searchString.length == 0) {
    alert("Please enter a value to search for!");
    return;
  }

  //Remove all Pagination buttons
  $("#registerbtns").children().remove();

  //Hide all rows and remove their classes
  $("#registerTable tbody")
    .children()
    .each(function () {
      //because we are clearing all classes, we have saved those which are scheduled in an array
      if ($(this).hasClass("scheduled") == true) {
        arr[o] = $(this);
        o++;
      }

      if ($(this).hasClass("confirmed") == true) {
        arr1[o1] = $(this);
        o1++;
      }
      $(this).removeClass();
      $(this).addClass("hidden");
      hiddenRowCount++;
      rowCount++;
    });

  for (let i = 0; i < arr.length; i++) {
    $(arr[i].addClass("scheduled"));
  }
  for (let i = 0; i < arr1.length; i++) {
    $(arr1[i].addClass("confirmed"));
  }

  $("#registerTable tbody")
    .children()
    .each(function (i) {
      if (
        $(this)
          .children("td")
          .eq(1)
          .html()
          .toUpperCase()
          .includes(searchString) == true ||
        $(this)
          .children("td")
          .eq(3)
          .html()
          .toUpperCase()
          .includes(searchString) == true
      ) {
        $(this).removeClass("hidden");
        hiddenRowCount--;
      }
    });

  if ($("#registerRadioAvailable").is(":checked")) {
    $("#registerTable tbody tr:not(.hidden)").each(function (i) {
      if ($(this).children().last().html() == 0) {
        $(this).addClass("hidden");
        hiddenRowCount++;
      }
    });
  }

  //how search happens when your courses radio button is checked
  else if ($("#registerRadioYou").is(":checked")) {
    //loop over every tr in the tbody of the table
    $("#registerTable tbody tr:not(.hidden)").each(function (i) {
      if (
        $(this).hasClass("scheduled") == false ||
        $(this).hasClass("confirmed")
      ) {
        $(this).addClass("hidden");
        hiddenRowCount++;
      }
    });
  }

  //get the rows that are not hidden and give them classes for pagination later on
  $("#registerTable tbody tr:not(.hidden)").each(function (i) {
    if (i >= 0 && i <= 9) $(this).addClass("firstRegister");
    else if (i >= 10 && i <= 19) $(this).addClass("secondRegister");
    else if (i >= 20 && i <= 29) $(this).addClass("thirdRegister");
    else if (i >= 30 && i <= 39) $(this).addClass("fourthRegister");
    else if (i >= 40 && i <= 49) $(this).addClass("fifthRegister");
    else if (i >= 50 && i <= 59) $(this).addClass("sixthRegister");
    else if (i >= 60 && i <= 69) $(this).addClass("seventhRegister");
    else if (i >= 70 && i <= 79) $(this).addClass("eightRegister");
    else if (i >= 80 && i <= 89) $(this).addClass("ninthRegister");
  });

  //make every row hidden except for those of the first page
  $("#registerTable tbody tr:not(.hidden)").each(function (i) {
    if ($(this).hasClass("firstRegister") == false) $(this).addClass("hidden");
  });

  //Get number of pagination buttons that need to be created
  rowCount = parseInt(rowCount - hiddenRowCount);
  let temp = rowCount % 10;
  rowCount = parseInt(rowCount / 10);
  if (temp != 0 || rowCount == 0) rowCount++;

  //create pagination buttons
  for (let i = 1; i <= rowCount; i++) {
    const registerButton = document.createElement("button");
    registerButton.id = "registerbtn${i}";
    registerButton.textContent = i;
    $("#registerbtns").append(registerButton);
    //Onclick button for these functions
    registerButton.onclick = function () {
      let x = 0;
      if (i == 1) x = $(".firstRegister");
      else if (i == 2) x = $(".secondRegister");
      else if (i == 3) x = $(".thirdRegister");
      else if (i == 4) x = $(".fourthRegister");
      else if (i == 5) x = $(".fifthRegister");
      else if (i == 6) x = $(".sixthRegister");
      else if (i == 7) x = $(".seventhRegister");
      else if (i == 8) x = $(".eightRegister");
      else if (i == 9) x = $(".ninthRegister");
      else x = $(".ninthRegister");

      //make every row hidden again
      $("#registerTable tbody tr").each(function (i) {
        $(this).addClass("hidden");
      });

      $(x).removeClass("hidden");

      //unactivate all buttons
      $("#registerbtns button").each(function (i) {
        $(this).removeClass("homepageActivated");
      });

      $(this).addClass("homepageActivated");
    };


  }
  //add homepageactivated to button that was clicked on
  $("#registerbtns").prepend('<button id="registerbtnFirst">&#10229;</button>');
  $("#registerbtnFirst").click(function () {
    $("#registerTable tbody tr").each(function (i) {
      $(this).addClass("hidden");
    });

    $(".firstRegister").removeClass("hidden");

    //unactivate all buttons
    $("#registerbtns button").each(function (i) {
      $(this).removeClass("homepageActivated");
    });

    $(this).addClass("homepageActivated");
  });
  let i = $("#registerbtns button:last-child").html();
  $("#registerbtns").append('<button id="registerbtnLast">&#10230;</button>');
  $("#registerbtnLast").click(function () {
    $("#registerTable tbody tr").each(function (i) {
      $(this).addClass("hidden");
    });
    let x = 0;
    if (i == 1) x = $(".firstRegister");
    else if (i == 2) x = $(".secondRegister");
    else if (i == 3) x = $(".thirdRegister");
    else if (i == 4) x = $(".fourthRegister");
    else if (i == 5) x = $(".fifthRegister");
    else if (i == 6) x = $(".sixthRegister");
    else if (i == 7) x = $(".seventhRegister");
    else if (i == 8) x = $(".eightRegister");
    else if (i == 9) x = $(".ninthRegister");
    else x = $(".ninthRegister");

    $(x).removeClass("hidden");

    //unactivate all buttons
    $("#registerbtns button").each(function (i) {
      $(this).removeClass("homepageActivated");
    });

    $(this).addClass("homepageActivated");
  });


  let iteration = 1;
  $("#registerTable tbody tr").not(".hidden").each(function (i) {
    if (iteration % 2 != 0) {
      $(this).css("background-color", "white");
    }
    else if (iteration % 2 == 0) {
      $(this).css("background-color", "rgb(247,247,247)");
    }
    iteration++;
  });
}

function reloadCourses() {
  let hiddenRowCount = 0,
    rowCount = 0;
  let arr = [],
    o = 0,
    arr1 = [],
    o1 = 0;

  //Remove all Pagination buttons
  $("#registerbtns").children().remove();

  //Hide all rows and remove their classes
  $("#registerTable tbody")
    .children()
    .each(function () {
      //because we are clearing all classes, we have saved those which are scheduled in an array
      if ($(this).hasClass("scheduled") == true) {
        arr[o] = $(this);
        o++;
      }
      if ($(this).hasClass("confirmed") == true) {
        arr1[o1] = $(this);
        o1++;
      }
      $(this).removeClass();
      $(this).addClass("hidden");
      hiddenRowCount++;
      rowCount++;
    });

  for (let i = 0; i < arr.length; i++) {
    $(arr[i].addClass("scheduled"));
  }
  for (let i = 0; i < arr1.length; i++) {
    $(arr1[i].addClass("confirmed"));
  }

  //How reload happens when avaiable radio button is checked
  if ($("#registerRadioAvailable").is(":checked")) {
    //loop over every tr in the tbody of the table
    $("#registerTable tbody")
      .children()
      .each(function (i) {
        //Show all trs that have seat number != 0
        if ($(this).children().last().html() != 0) {
          $(this).removeClass("hidden");
          hiddenRowCount--;
        }
      });
  }
  //how reload happens when all radio buttion is checked
  else if ($("#registerRadioAll").is(":checked")) {
    //loop over every tr in the tbody of the table
    $("#registerTable tbody")
      .children()
      .each(function (i) {
        //Show all trs
        $(this).removeClass("hidden");
        hiddenRowCount--;
      });
  }

  //how reload happens when your courses radio button is checked
  else if ($("#registerRadioYou").is(":checked")) {
    //loop over every tr in the tbody of the table
    $("#registerTable tbody")
      .children()
      .each(function (i) {
        //Show all trs that have the class scheduled
        if ($(this).hasClass("scheduled") || $(this).hasClass("confirmed")) {
          $(this).removeClass("hidden");
          hiddenRowCount--;
        }
      });
  }

  //get the rows that are not hidden and give them classes for pagination later on
  $("#registerTable tbody tr:not(.hidden)").each(function (i) {
    if (i >= 0 && i <= 9) $(this).addClass("firstRegister");
    else if (i >= 10 && i <= 19) $(this).addClass("secondRegister");
    else if (i >= 20 && i <= 29) $(this).addClass("thirdRegister");
    else if (i >= 30 && i <= 39) $(this).addClass("fourthRegister");
    else if (i >= 40 && i <= 49) $(this).addClass("fifthRegister");
    else if (i >= 50 && i <= 59) $(this).addClass("sixthRegister");
    else if (i >= 60 && i <= 69) $(this).addClass("seventhRegister");
    else if (i >= 70 && i <= 79) $(this).addClass("eightRegister");
    else if (i >= 80 && i <= 89) $(this).addClass("ninthRegister");
  });

  //make every row hidden except for those of the first page
  $("#registerTable tbody tr:not(.hidden)").each(function (i) {
    if ($(this).hasClass("firstRegister") == false) $(this).addClass("hidden");
  });

  //Get number of pagination buttons that need to be created
  rowCount = parseInt(rowCount - hiddenRowCount);
  let temp = rowCount % 10;
  rowCount = parseInt(rowCount / 10);
  if (temp != 0 || rowCount == 0) rowCount++;

  //create pagination buttons
  for (let i = 1; i <= rowCount; i++) {
    const registerButton = document.createElement("button");
    registerButton.id = "registerbtn${i}";
    registerButton.textContent = i;
    $("#registerbtns").append(registerButton);
    //Onclick button for these functions
    registerButton.onclick = function () {
      let x = 0;
      if (i == 1) x = $(".firstRegister");
      else if (i == 2) x = $(".secondRegister");
      else if (i == 3) x = $(".thirdRegister");
      else if (i == 4) x = $(".fourthRegister");
      else if (i == 5) x = $(".fifthRegister");
      else if (i == 6) x = $(".sixthRegister");
      else if (i == 7) x = $(".seventhRegister");
      else if (i == 8) x = $(".eightRegister");
      else if (i == 9) x = $(".ninthRegister");
      else x = $(".ninthRegister");

      //make every row hidden again
      $("#registerTable tbody tr").each(function (i) {
        $(this).addClass("hidden");
      });

      $(x).removeClass("hidden");

      //unactivate all buttons
      $("#registerbtns button").each(function (i) {
        $(this).removeClass("homepageActivated");
      });

      $(this).addClass("homepageActivated");
    };
  }
  //add homepageactivated to button that was clicked on
  $("#registerbtns").prepend('<button id="registerbtnFirst">&#10229;</button>');
  $("#registerbtnFirst").click(function () {
    $("#registerTable tbody tr").each(function (i) {
      $(this).addClass("hidden");
    });

    $(".firstRegister").removeClass("hidden");

    //unactivate all buttons
    $("#registerbtns button").each(function (i) {
      $(this).removeClass("homepageActivated");
    });

    $(this).addClass("homepageActivated");
  });

  let i = $("#registerbtns button:last-child").html();
  $("#registerbtns").append('<button id="registerbtnLast">&#10230;</button>');
  $("#registerbtnLast").click(function () {
    $("#registerTable tbody tr").each(function (i) {
      $(this).addClass("hidden");
    });
    let x = 0;
    if (i == 1) x = $(".firstRegister");
    else if (i == 2) x = $(".secondRegister");
    else if (i == 3) x = $(".thirdRegister");
    else if (i == 4) x = $(".fourthRegister");
    else if (i == 5) x = $(".fifthRegister");
    else if (i == 6) x = $(".sixthRegister");
    else if (i == 7) x = $(".seventhRegister");
    else if (i == 8) x = $(".eightRegister");
    else if (i == 9) x = $(".ninthRegister");
    else x = $(".ninthRegister");

    $(x).removeClass("hidden");

    //unactivate all buttons
    $("#registerbtns button").each(function (i) {
      $(this).removeClass("homepageActivated");
    });

    $(this).addClass("homepageActivated")
  });
  let iteration = 1;
  $("#registerTable tbody tr").not(".hidden").each(function (i) {
    if (iteration % 2 != 0) {
      $(this).css("background-color", "white");
    }
    else if (iteration % 2 == 0) {
      $(this).css("background-color", "rgb(247,247,247)");
    }
    iteration++;
  });
}

//Course Registration function to load courses, called only once
function loadCourses() {
  //count of rows in total, hidden or not
  let count = 0;

  fetch("summercourses.json")
    .then((response) => response.json())
    .then((data) => {
      const tbody = document.querySelector("#registerTable tbody");

      data.forEach((item) => {
        const row = document.createElement("tr");
        const courseCell = document.createElement("td");
        const secCell = document.createElement("td");
        const titleCell = document.createElement("td");
        const creditCell = document.createElement("td");
        const daysCell = document.createElement("td");
        const startCell = document.createElement("td");
        const endCell = document.createElement("td");
        const seatCell = document.createElement("td");

        courseCell.textContent = item.CourseNbr;
        secCell.textContent = item.Sec;
        titleCell.textContent = item.CourseTitle;
        creditCell.textContent = item.Cr;
        daysCell.textContent = item.DAYS;
        startCell.textContent = item.StartTime;
        endCell.textContent = item.EndTime;
        seatCell.textContent = item.Seats;

        $(row).append(
          '<td><button class="registerButtonCourseControl" onclick="scheduleCourse(this)">&plus;</button></td>'
        );
        row.appendChild(courseCell);
        row.appendChild(secCell);
        row.appendChild(titleCell);
        row.appendChild(creditCell);
        row.appendChild(daysCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(seatCell);

        tbody.appendChild(row);

        if (count >= 10) {
          row.classList.add("hidden");
        }
        if (count >= 0 && count < 10) row.classList.add("firstRegister");
        else if (count >= 10 && count < 20) row.classList.add("secondRegister");
        else if (count >= 20 && count < 30) row.classList.add("thirdRegister");
        else if (count >= 30 && count < 40) row.classList.add("fourthRegister");
        else if (count >= 40 && count < 50) row.classList.add("fifthRegister");
        else if (count >= 50 && count < 60) row.classList.add("sixthRegister");
        else if (count >= 60 && count < 70)
          row.classList.add("seventhRegister");
        else if (count >= 70 && count < 80) row.classList.add("eightRegister");
        else if (count >= 80 && count < 90) row.classList.add("ninthRegister");

        count++;
      });

      rowCount = $("#registerTable tbody tr").length;

      //Pagination Code

      //add the buttons themselves
      //you have to add these buttons dynamically

      if (count % 10 != 0) {
        count = parseInt(count / 10);
        count = count + 1;
      } else {
        count = parseInt(count / 10);
      }

      for (let i = 0; i < count; i++) {
        if (i == 0)
          $("#registerbtns").append(
            '<button id="registerbtnFirst">&#10229;</button> <button id="registerbtnOne" class="homepageActivated">1</button>'
          );
        else if (i == 1)
          $("#registerbtns").append('<button id="registerbtnTwo">2</button>');
        else if (i == 2)
          $("#registerbtns").append('<button id="registerbtnThree">3</button>');
        else if (i == 3)
          $("#registerbtns").append('<button id="registerbtnFour">4</button>');
        else if (i == 4)
          $("#registerbtns").append('<button id="registerbtnFive">5</button>');
        else if (i == 5)
          $("#registerbtns").append('<button id="registerbtnSix">6</button>');
        else if (i == 6)
          $("#registerbtns").append('<button id="registerbtnSeven">7</button>');
        else if (i == 7)
          $("#registerbtns").append('<button id="registerbtnEight">8</button>');
        else if (i == 8)
          $("#registerbtns").append('<button id="registerbtnNine">9</button>');

        //$("#registerbtns").append('<button id="registerbtnLast">&#10230;</button>');
      }
      $("#registerbtns").append(
        '<button id="registerbtnLast">&#10230;</button>'
      );

      //$("#registerbtns").append(' <button id="registerbtnFirst">&#10229;</button> <button id="registerbtnOne" class="homepageActivated">1</button> <button id="registerbtnTwo">2</button> <button id="registerbtnThree">3</button> <button id="registerbtnFour">4</button> <button id="registerbtnFive">5</button> <button id="registerbtnSix">6</button> <button id="registerbtnSeven">7</button> <button id="registerbtnEight">8</button> <button id="registerbtnNine">9</button> <button id="registerbtnLast">&#10230;</button>');

      $("#registerbtns button").each(function (i) {
        //make every single row as hidden
        if (i > count) {
          //get last button in registerbtns
          $(this).click(function () {
            $("#registerTable tbody tr").each(function (i) {
              $(this).addClass("hidden");
            });

            //make it do the same function as that of the before last number
            let arr = $("#registerbtns button").toArray();
            let i = arr.length;
            i = i - 2;
            let x = 0;
            if (i == 1 || i == 0) x = $(".firstRegister");
            else if (i == 2) x = $(".secondRegister");
            else if (i == 3) x = $(".thirdRegister");
            else if (i == 4) x = $(".fourthRegister");
            else if (i == 5) x = $(".fifthRegister");
            else if (i == 6) x = $(".sixthRegister");
            else if (i == 7) x = $(".seventhRegister");
            else if (i == 8) x = $(".eightRegister");
            else if (i == 9) x = $(".ninthRegister");
            else x = $(".ninthRegister");

            $(x).removeClass("hidden");
            //unactivate all buttons
            $("#registerbtns button").each(function (i) {
              $(this).removeClass("homepageActivated");
            });

            //add homepageactivated to button that was clicked on
            $(this).addClass("homepageActivated");
          });

          return;
        }

        $(this).click(function () {
          $("#registerTable tbody tr").each(function (i) {
            $(this).addClass("hidden");
          });

          //make every row of class current iteration register as not hidden
          let x = 0;
          if (i == 1 || i == 0) x = $(".firstRegister");
          else if (i == 2) x = $(".secondRegister");
          else if (i == 3) x = $(".thirdRegister");
          else if (i == 4) x = $(".fourthRegister");
          else if (i == 5) x = $(".fifthRegister");
          else if (i == 6) x = $(".sixthRegister");
          else if (i == 7) x = $(".seventhRegister");
          else if (i == 8) x = $(".eightRegister");
          else if (i == 9) x = $(".ninthRegister");
          else x = $(".ninthRegister");

          $(x).removeClass("hidden");

          //unactivate all buttons
          $("#registerbtns button").each(function (i) {
            $(this).removeClass("homepageActivated");
          });

          //add homepageactivated to button that was clicked on
          $(this).addClass("homepageActivated");
        });
      });
    })
    .catch((error) => console.error(error));
}

function scheduleCourse(el) {
  //get parent row of the clicked on button
  let row = $(el).parent().parent();

  //assign a new class to that parent row
  row.addClass("scheduled");

  //change html of button to x
  $(el).html("X");

  //change function of this button
  $(el).attr("onclick", "descheduleCourse(this)");
}

function descheduleCourse(el) {
  let row = $(el).parent().parent();

  //assign a new class to that parent row
  if (!row.hasClass("confirmed")) row.removeClass("scheduled");
  else {
    if (confirm("The course will be dropped\nPress OK to confirm.")) {
      row.removeClass("confirmed");
      row.removeClass("scheduled");
    } else {
      return;
    }
  }

  //change html of button to x
  $(el).html("+");

  //change function of this button
  $(el).attr("onclick", "scheduleCourse(this)");

  setCreditScore();
}

function commitCourses(el) {
  let confirmedLength = $(".confirmed").length;
  let scheduledLength = $(".scheduled").length;

  let confirmedDates = [];
  let scheduledDates = [];
  let confirmedStartTimes = [];
  let confirmedEndTimes = [];
  let scheduledStartTimes = [];
  let scheduledEndTimes = [];

  //initialize confirmed times
  for (let i = 0; i < confirmedLength; i++) {
    let inputs = $(".confirmed");
    confirmedStartTimes[i] = JSON.stringify(
      $(inputs[i]).children().eq(6).html()
    );
    confirmedEndTimes[i] = JSON.stringify($(inputs[i]).children().eq(7).html());
    confirmedDates[i] = JSON.stringify($(inputs[i]).children().eq(5).html());
  }

  //initialize end times
  for (let i = 0; i < scheduledLength; i++) {
    let inputs = $(".scheduled");
    scheduledStartTimes[i] = JSON.stringify(
      $(inputs[i]).children().eq(6).html()
    );
    scheduledEndTimes[i] = JSON.stringify($(inputs[i]).children().eq(7).html());
    scheduledDates[i] = JSON.stringify($(inputs[i]).children().eq(5).html());
  }

  //compare the times for overlaps
  if (
    hasOverlap(
      confirmedLength,
      scheduledLength,
      confirmedStartTimes,
      confirmedEndTimes,
      scheduledStartTimes,
      scheduledEndTimes,
      scheduledDates,
      confirmedDates
    )
  )
    return;

  //check if theres an overlap between scheduled courses
  if (
    hasOverlappedBetweenScheduled(
      scheduledLength,
      scheduledStartTimes,
      scheduledEndTimes,
      scheduledDates
    )
  )
    return;

  //check if the number of seats is different from 0
  if (!checkIfAvailable(scheduledLength)) return;

  //check if user has already registered for this course but in a different section
  if (checkSameSection(scheduledLength, confirmedLength)) return;

  //same as above but for simulatenous adding
  if (checkSameNameSimultaneously(scheduledLength)) return;

  //loop over every row with the class scheduled
  $(".scheduled").each(function (i) {
    //check if true

    $(this).removeClass("scheduled");
    $(this).addClass("confirmed");
    let z = $(this).children().eq(8).html() - 1;
    $(this).children().eq(8).html(z);
  });

  //increase credits score
  setCreditScore();
}

function quickAddCourse(el) {
  let courseNumber = $(el).parent().parent().children().eq(0).val();
  let courseSection = $(el).parent().parent().children().eq(1).val();
  let confirmedLength = $(".confirmed").length;
  let scheduledLength = 1;

  let confirmedDates = [];
  let scheduledDates = [];
  let confirmedStartTimes = [];
  let confirmedEndTimes = [];
  let scheduledStartTimes = [];
  let scheduledEndTimes = [];

  //initialize confirmed times
  for (let i = 0; i < confirmedLength; i++) {
    let inputs = $(".confirmed");
    confirmedStartTimes[i] = JSON.stringify(
      $(inputs[i]).children().eq(6).html()
    );
    confirmedEndTimes[i] = JSON.stringify($(inputs[i]).children().eq(7).html());
    confirmedDates[i] = JSON.stringify($(inputs[i]).children().eq(5).html());
  }

  let savedRow = 0;

  //initialize end times
  let countTemp = 0;
  $(".table-responsive tbody tr").each(function (i) {
    if (
      $(this).children().eq(1).html() == courseNumber.toUpperCase() &&
      $(this).children().eq(2).html() == courseSection
    ) {
      scheduledStartTimes[0] = JSON.stringify($(this).children().eq(6).html());
      scheduledEndTimes[0] = JSON.stringify($(this).children().eq(7).html());
      scheduledDates[0] = JSON.stringify($(this).children().eq(5).html());
      countTemp++;
      savedRow = $(this);
      $(this).addClass("scheduled");
      return;
    }
  });
  if (countTemp == 0) {
    alert(
      "No course with the id " +
      courseNumber +
      " and section " +
      courseSection +
      " exists"
    );
    return;
  }



  let hasErred = false;
  //check if user has already registered for this course but in a different section
  $(".confirmed").each(function (i) {
    if (
      $(this).children().eq(1) == courseNumber.toUpperCase() &&
      $(this).children().eq(2) != courseSection
    ) {
      alert(
        "The scheduled course " +
        courseNumber +
        " has already been confirmed registered for another section"
      );
      hasErred = true;
      $(savedRow).removeClass("scheduled");
    }
  });
  //same as above but same course different name
  for (let i = 0; i < confirmedLength; i++) {
    $(".confirmed").each(function (i) {
      let oi = $(this).children().eq(1).html();
      let io = courseNumber.toUpperCase();
      if (
        $(this).children().eq(1).html() == courseNumber.toUpperCase()
      ) {
        alert(
          "The scheduled course " +
          courseNumber +
          " has already been confirmed registered for another section"
        );
        hasErred = true;
      }
    });
  }

  //compare the times for overlaps
  if (
    hasOverlap(
      confirmedLength,
      scheduledLength,
      confirmedStartTimes,
      confirmedEndTimes,
      scheduledStartTimes,
      scheduledEndTimes,
      scheduledDates,
      confirmedDates
    )
  ) {
    $(savedRow).removeClass("scheduled");
    return;
  }

  if (
    hasOverlappedBetweenScheduled(
      scheduledLength,
      scheduledStartTimes,
      scheduledEndTimes,
      scheduledDates
    )
  )
    return;

  //check if the number of seats is different from 0
  if ($(savedRow).children().eq(8).html() == 0) {
    alert(
      "The scheduled course " +
      courseNumber +
      " does not have any seats available"
    );
    $(savedRow).removeClass("scheduled");
    return; //not available
  }
  if (hasErred) {
    $(savedRow).removeClass("scheduled");
    return;
  }

  $(savedRow).removeClass("scheduled");
  $(savedRow).addClass("confirmed");

  $(savedRow).children().eq(0).html

  let z = $(savedRow).children().eq(8).html() - 1;
  $(savedRow).children().eq(0).children().eq(0).html("X");
  $(savedRow).children().eq(0).children().eq(0)("onclick", "descheduleCourse(this)");
  setCreditScore();
}

// function convertTimeFormat(time) {
//   let date = new Date('01/01/2022 ${time}');
//   let hours = date.getHours();
//   let minutes = date.getMinutes();
//   let seconds = date.getSeconds();
//   hours = hours < 10 ? '0${hours}' : hours;
//   minutes = minutes < 10 ? '0${minutes}' : minutes;
//   seconds = seconds < 10 ? '0${seconds}' : seconds;
//   return '${hours}:${minutes}:${seconds}';
// }

//why is there such a difference between the single quotation in the function up and the single quotation down here :( This function does not working up
function convertTimeFormat(time) {
    let date = new Date(`01/01/2022 ${time}`);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
}

//convert time to milliseconds
//I dont know why h is being added by 2, but if it works it works (i.e 09:00:00 will be converted to equivalent of 11:00:00)
function timeToMilliseconds(timeString) {
  let time = new Date("1970-01-01T" + timeString + "Z");
  let milliseconds = time.getTime();

  return milliseconds;
}

function setCreditScore() {
  let score = 0;
  $(".confirmed").each(function (i) {
    let x = JSON.stringify($(this).children().eq(4).html());
    //for some reason 0 is saved with some other string elements, by using .match(/\d+/g) we make sure that all numbers are counted only
    let y = x.match(/\d+/g);
    score = parseInt(score) + parseInt(y);
  });
  $("#registerCreditsScore").html(score);
}

function hasOverlap(
  confirmedLength,
  scheduledLength,
  confirmedStartTimes,
  confirmedEndTimes,
  scheduledStartTimes,
  scheduledEndTimes,
  scheduledDates,
  confirmedDates
) {
  for (let i = 0; i < confirmedLength; i++) {
    let startI = new Date();
    startI.setTime(
      timeToMilliseconds(convertTimeFormat(confirmedStartTimes[i]))
    );
    let endI = new Date();
    endI.setTime(timeToMilliseconds(convertTimeFormat(confirmedEndTimes[i])));
    let dateI = confirmedDates[i];
    for (let j = 0; j < scheduledLength; j++) {
      let startJ = new Date();
      startJ.setTime(
        timeToMilliseconds(convertTimeFormat(scheduledStartTimes[j]))
      );
      let endJ = new Date();
      endJ.setTime(timeToMilliseconds(convertTimeFormat(scheduledEndTimes[j])));
      let dateJ = scheduledDates[j];

      //check for overlap (theorem: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap)
      if (startI <= endJ && endI >= startJ && checkDaysOverlap(dateI, dateJ)) {
        let inputScheduled = $(".scheduled");
        let inputConfirmed = $(".confirmed");
        alert(
          "There is an overlap between the scheduled course " +
          $(inputScheduled[i]).children().eq(1).html() +
          " and the confirmed course " +
          $(inputConfirmed[j]).children().eq(1).html()
        );
        return true;
      }
    }
  }

  return false;
}

function checkIfAvailable(scheduledLength) {
  for (let i = 0; i < scheduledLength; i++) {
    let inputs = $(".scheduled");
    let x = JSON.stringify($(inputs[i]).children().eq(8).html());
    //for some reason 0 is saved with some other string elements, by using .match(/\d+/g) we make sure that all numbers are counted only
    let y = x.match(/\d+/g);
    if (y == 0) {
      alert(
        "The scheduled course " +
        $(inputs[i]).children().eq(1).html() +
        " does not have any seats available"
      );
      return false; //not available
    }
  }

  return true;
}

function checkSameSection(scheduledLength, confirmedLength) {
  for (let i = 0; i < scheduledLength; i++) {
    let iInput = $(".scheduled");
    let iInputString = JSON.stringify($(iInput[i]).children().eq(1).html());
    for (let j = 0; j < confirmedLength; j++) {
      let jInput = $(".confirmed");
      let jInputString = JSON.stringify($(jInput[i]).children().eq(1).html());
      if (iInputString == jInputString) {
        alert(
          "The scheduled course " +
          iInputString +
          " has already been confirmed registered for another section"
        );
        return true;
      }
    }
  }
  return false;
}

function checkSameNameSimultaneously(scheduledLength) {
  for (let i = 0; i < scheduledLength; i++) {
    let iInput = $(".scheduled");
    let iInputString = JSON.stringify($(iInput[i]).children().eq(1).html());
    for (let j = i + 1; j < scheduledLength; j++) {
      let jInput = $(".scheduled");
      let jInputString = JSON.stringify($(jInput[j]).children().eq(1).html());
      if (iInputString == jInputString) {
        alert(
          "You can't register for 2 equivalent courses!: " + iInputString
        );
        return true;
      }
    }
  }
  return false;
}

function checkDaysOverlap(confirmedDate, scheduledDate) {
  for (let i = 0; i < confirmedDate.length; i++) {
    for (let j = 0; j < scheduledDate.length; j++) {
      if (
        confirmedDate[i] == scheduledDate[j] &&
        (confirmedDate[i] == "M" ||
          confirmedDate[i] == "T" ||
          confirmedDate[i] == "W" ||
          confirmedDate[i] == "R") &&
        (scheduledDate[i] == "M" ||
          scheduledDate[i] == "T" ||
          scheduledDate[i] == "W" ||
          scheduledDate[i] == "R")
      ) {
        return true; //there is an overlap in days
      }
    }
  }
  return false;
}

function hasOverlappedBetweenScheduled(
  scheduledLength,
  scheduledStartTimes,
  scheduledEndTimes,
  scheduledDates
) {
  for (let i = 0; i < scheduledLength; i++) {
    let startI = new Date();
    startI.setTime(
      timeToMilliseconds(convertTimeFormat(scheduledStartTimes[i]))
    );
    let endI = new Date();
    endI.setTime(timeToMilliseconds(convertTimeFormat(scheduledEndTimes[i])));
    let dateI = scheduledDates[i];

    for (let j = i + 1; j < scheduledLength; j++) {
      let startJ = new Date();
      startJ.setTime(
        timeToMilliseconds(convertTimeFormat(scheduledStartTimes[j]))
      );
      let endJ = new Date();
      endJ.setTime(timeToMilliseconds(convertTimeFormat(scheduledEndTimes[j])));
      let dateJ = scheduledDates[j];

      //check for overlap (theorem: https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap)
      if (startI <= endJ && endI >= startJ && checkDaysOverlap(dateI, dateJ)) {
        let inputScheduled = $(".scheduled");
        alert(
          "There is an overlap between the scheduled courses " +
          JSON.stringify($(inputScheduled[i]).children().eq(1).html()) +
          " and " +
          JSON.stringify($(inputScheduled[j]).children().eq(1).html())
        );
        return true;
      }
    }
  }

  return false;
}

//navbar code i forgot what this was for lol
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

//files code
function displayPDF(el) {
  let hasAdded = false;
  let src = "pdf/tuition.pdf";//default pdf file just in case

  $("body>*:not(#filesPDF)").addClass("fileBodyHidden");
  $("#filesPDF").removeClass("hidden");
  if ($(el).parent().parent().children().eq(0).children().eq(0).children().eq(1).html().includes("Tuition Fees")) {
    src = "pdf/tuition.pdf";
    $("#filesPDF").append("<iframe class='PDF' src='" + src + "' frameborder='0'></iframe>");
    $("#bodyFiles .download").each(function () {
      $(this).addClass("disabledAnchor");
    });
  }
  else if ($(el).parent().parent().children().eq(0).children().eq(0).children().eq(1).html().includes("Statement of Fees")) {
    let globalUsername = Cookies.get('username');
    fetch("users.json")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          if (item.ID == globalUsername) {
            src = item.StatementOfFees;
            //i hate asynchronous functions :) //class = pdf frameborder=0 check ur link
            $("#filesPDF").append("<iframe class='PDF' src='" + src + "' frameborder='0'></iframe>");
            $("#bodyFiles .download").each(function () {
              $(this).addClass("disabledAnchor");
            });
            hasAdded = true;
            return;
          }
        });
      });
  }
}

function closePDF(el) {
  $("body>*:not(#filesPDF)").removeClass("fileBodyHidden");
  $("#filesPDF").addClass("hidden");
  $("#filesPDF iframe").remove();
  $("#bodyFiles .download").each(function () {
    $(this).removeClass("disabledAnchor");
  });
}

function loadGpaTablesProfile(savedIndex) {
  let blabla = 0;

  //append a grades table
  fetch("users.json")
    .then((response) => response.json())
    .then((data) => {
      $.each(data[savedIndex].Grades, function (index, term) {
        $("#profileGrades").append('<div class="gpaGradeTableContainer table-responsive"><table class="table" id="gpaGradesTable"><thead><tr><th scope="col">Course Title</th><th scope="col">Credits</th><th scope="col">Pass</th><th scope="col">Grade</th><th scope="col">Letter Grade</th></tr></thead><tbody></tbody></table><div class="gpaGradeTableGrades"></div></div>');
        $.each(term.Courses, function (index, course) {
          let x = $("#profileGrades").children().eq(blabla + 2).children().eq(0).children().eq(1);
          $("#profileGrades").children().eq(blabla + 2).children().eq(0).children().eq(1).append('<tr><td data-toggle="tooltip" data-placement="top" title="' + course["Course Description"] + '"style="cursor:help;">' + course.CourseName + '</td><td>' + course.Credit + '</td><td>' + course.Pass + '</td><td>' + course.Grade + '</td><td>' + course.LetterGrade + '</td></tr>');
        });
        $("#profileGrades").children().eq(blabla + 2).children().eq(1).append('<p><b>Term GPA: </b>' + term.TermGpa + '</p>');
        $("#profileGrades").children().eq(blabla + 2).children().eq(1).append('<p><b>Cumulative GPA: </b>' + term.CumGpa + '</p>')
        blabla++;
      });
      getGradesProfile();
    });
}

function getGradesProfile() {
  let x = $("#gpaGradeSelect").prop('selectedIndex');
  $(".gpaGradeTableContainer").each(function () {
    $(this).addClass("hidden");
  })
  $("#profileGrades").children().eq(x + 2).removeClass("hidden");
}
