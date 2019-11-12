//BUDGET CONTROLLER

var budgetController = (function() {
    //create a data model for expenses and income -- each item will have a desc and value. Need to also diff between items so we need a unique id
    //we want to create lots of objects so we need function constructors which we will use to instantiate all of the objects
    //EXPENSE AND INCOME FUNCTION CONSTRUCTORS
    var Expense = function(id, description, value) {
        this.id          = id;
        this.description = description;
        this.value       = value;
        this.percentage  = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        //calc actual percentage
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id          = id;
        this.description = description;
        this.value       = value;
    };

    //combine functions to use type as an argument to let the function choose between income and expense
    var calculateTotal = function(type) {
        var sum = 0; //initial value
        //loop over array
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        //store in global "data" structure 
        data.totals[type] = sum;
    };

    //create a large object structure to store all of the data variables to keep code clean and organized
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    //create a new public method to allow the other modules to add new items into the data structure
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //since type is defined in the input then the getInput function and then used here, we can use [type] to select which array in the data structure to modify... 
            //id = data.allItems[exp|inc]
            //...[data.allItems[type].length -1] looks at the type array and the length and finds the last number POSITION in the array going by the length, then the array position and subtracting 1.
            //then .id + 1 adds an integer of 1 to the last item in the array
            //ex: [1,2,4,5,7], next ID = 8 SO we want id = last id + 1
            //CREATE NEW ID
            //when id is empty it should = 0
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
            //CREATE NEW ITEM BASED ON TYPE INC OR EXP
            if(type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //PUSH TO OUR DATA STRUCTURE
            data.allItems[type].push(newItem);
            //return the newItem so another module or function that calls this one will have access
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            //create an array with all of the id numbers we have and loop over them
            //map returns a brand new array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {            
            //calc sum of all incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calc budget = inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            //only calculate if there is income listed to prevent dividing by zero
            if(data.totals.inc > 0) {
                //percentage of income spent
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

            // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        },

        calculatePercentages: function() {
             /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */

            //1. calc the exp % for each of the exp objects that are stored in the expense array
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        //testing to see if data exists in the data structure method
        testing: function() {
            console.log("TCL: budgetController -> data", data)
        }
    };

})();


//UI CONTROLLER
var UIController = (function() {
    //refactoring code to make changes in the future easier by creating an object that contains the strings of the values we would use in our selectors
    //making this available in the global app controller as well by creating a new var DOM with access to the object here in this controller
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */
       
       //calc the absolute number
       num = Math.abs(num);
       num = num.toFixed(2);

       numSplit = num.split('.');
       
       int = numSplit[0];

        if(int.length > 3) {
            var zeros;
            zeros = Math.floor((int.length-1)/3);
            if(zeros === 1) {
                int = int.substr(0, int.length-3) + ',' + int.substr(int.length - 3 ,3);
            } else {
                for(var i = 0; i < zeros; i++) {
                    int = int.substr(0, int.length-(3 * zeros) + 3 * i) + ',' + int.substr(int.length - 3 * zeros + 3 * i , 3 * zeros);
                }
            }
        }

       dec = numSplit[1];

       return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback) {
        for(var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            //return the values from all three inputs in a single object
            return { 
                type: document.querySelector(DOMstrings.inputType).value, // + inc || - exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            //replace the html string placeholder text with data that we get from obj
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        //clearing the input fields
        clearFields: function() {
            var fields, fieldsArr;
            //returns a list 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            //convert the list to an array and slice
            //use the call method and pass fields into it so it becomes the THIS variable
            //slice is in the Array prototype
            fieldsArr = Array.prototype.slice.call(fields);
            //loop over the array and clear the fields
            //pass a callback function to the method and the function will be available to each of the elements in the array
            //current, index,array are the args
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });
            //set the focus back to the desc field
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'

            document.querySelector(DOMstrings.budgetLabel).textContent     = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent     = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent   = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {
            //node list
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            //create a new foreach function for node list

            //first class function explanation
            /* 
               when we call our nodeListForEach function, we pass a callback function into it. So this function is assigned to this callback parameter. And so, in here, we then loop over our list, for however many elements are in our list and then in each iteration, the callback function gets called with these arguments( list[i] and i ) which were specified in the nodeListForEach function ( current and index ) and now since we passed them into the callback ( list[i] and i ) we have access to the current element and current index
            */

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var now, year, month, months;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
                
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },
 
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();


//GLOBAL APP CONTROLLER
//use the app controller to call the methods to tell the other modules what to do
var controller = (function(budgetCtrl, UICtrl) {
    //event listener functions
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };


    var updateBudget = function() {
        //1. calculate the budget
        budgetCtrl.calculateBudget();

        //2. return the budget
        var budget = budgetCtrl.getBudget();

        //3. display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        //1. calc the percentages
        budgetCtrl.calculatePercentages();
        //2. read them from the budget controller
        var percentages = budgetCtrl.getPercentages();
        //3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;
        //1. get the values from the input fields
        input = UICtrl.getInput();
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {
            //2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4 clear the fields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();

            //6. calc and update the percentages
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            //inc-1 example
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //2. delete the item from the user interface
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();

            //4. calc and update the percentages
            updatePercentages();

        }
    };


    //code that we want to be executed as soon as the page loads. 
    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    

})(budgetController, UIController);

controller.init();





























