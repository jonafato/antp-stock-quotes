var SYMBOLS_KEY = 'symbols',
symbols = [],
quotes = [];

angular.module('app', []).controller('mainController', ['$scope', '$http', function($scope, $http) {
    // Initial values
    $scope.mode = 'main';
    $scope.sprintf = sprintf;
    $scope.symbols = symbols;
    $scope.quotes = quotes;
    $scope.refreshState = '';
    
    chrome.storage.sync.get(SYMBOLS_KEY, function(items) {
        items = items[SYMBOLS_KEY] || [];
        if(items.length === 0) {
            items = ['GOOG', 'AAPL', 'MSFT', 'AMZN'];
        }
        $scope.$apply(function() {
            Array.prototype.push.apply(symbols, items);
            $scope.refresh();
        });
    });

    $scope.removeSymbol = function(symbol) {
        symbol = symbol.trim().toUpperCase();
        var index = symbols.indexOf(symbol);
        if(index > -1) {
            symbols.splice(index, 1);
        }
    };

    $scope.setMode = function(mode) {
        if(mode === 'main') {
            $scope.refresh();
        }
        $scope.mode = mode;
    };

    $scope.refresh = function() {
        $scope.refreshState = 'refreshing';

        var save = function() {
            var items = {};
            items[SYMBOLS_KEY] = symbols;
            chrome.storage.sync.set(items);
            $scope.refreshState = '';
        };

        if(symbols.length > 0) {
            var query = 'select * from yahoo.finance.quotes where symbol IN ("%s")'.printf(symbols.join('", "'));
            $http({
                method: 'GET',
                url: 'http://query.yahooapis.com/v1/public/yql',
                params: {
                    format: 'json',
                    q: query,
                    env: 'http://datatables.org/alltables.env',
                },
            }).success(function(data, status, headers, config) {
                quotes.length = 0;
                var fetchedQuotes = data.query.results.quote;
                if(typeof fetchedQuotes.length === 'undefined') {
                    fetchedQuotes = [fetchedQuotes];
                }
                for(i = 0, j = fetchedQuotes.length; i < j; i++) {
                    quotes.push({
                        symbol: fetchedQuotes[i].symbol,
                        price: fetchedQuotes[i].Ask || fetchedQuotes[i].LastTradePriceOnly,
                        change: parseFloat(fetchedQuotes[i].Change.slice(1)),
                        changeDirection: fetchedQuotes[i].Change.slice(0, 1),
                    });
                }
                save();
            }).error(function(data, status, headers, config) {
                $scope.refreshState = '';
            });
        }
        else {
            quotes.length = 0;
            save();
        }
    };
}]).controller('formController', ['$scope', '$http', function($scope, $http) {
    $scope.newSymbol = '';

    $scope.addSymbol = function(symbol) {
        symbol = symbol.trim().toUpperCase();
        if(symbol.length > 0) {
            symbols.push(symbol);
        }
        $scope.newSymbol = '';
        $scope.form.$setPristine();
    };
}]);
