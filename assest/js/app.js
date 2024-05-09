var app = angular.module('myApp', ['ui.bootstrap']);

app.controller('myCtrl', function ($scope, $uibModal, $http) {
    $scope.modalContent = "Initial content";
    $scope.openModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'detail_info.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                modalContent: function () {
                    return $scope.modalContent;
                }
            }
        });

        modalInstance.result.then(function (result) {
            // Xử lý kết quả nếu cần
        }, function () {
            // Xử lý khi modal bị đóng
        });
    };

    const apiKey = "511c0d53e786d6e701870951d85c605d";
    const apiUrlOpenweatherMap = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=20.98&lon=105.8&cnt=7&appid=e83b3c4c08285bf87b99f9bbc0abe3f0&lang=vi";
    const apiUrlWeatherAPI = "https://api.weatherapi.com/v1/forecast.json?key=534c61d0f2c14713a08153312232112&q=20.980841433208266%2C105.79592808822972&lang=vi&alerts=yes";
    $scope.urlImg = "https://openweathermap.org/img/wn/";

    $scope.toFixed = function (number, precision) {
        return parseFloat(number).toFixed(precision);
    };
    $scope.epochToDate = function (epoch) {
        if (!epoch) {
            return '';
        }
        var date = new Date(epoch * 1000); // Convert epoch to milliseconds
        var options = {
            weekday: 'long'
        };
        return date.toLocaleDateString('vi-VN', options); // Format date to Vietnamese
    };
    $scope.getDayName = function (number) {
        var date = new Date(number);
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    $scope.listForecast7Days = [];

    var initForecast7Days = function () {
        var promise = $http({
            method: 'GET',
            url: apiUrlOpenweatherMap,
            headers: {
                'Content-type': ' application/json'
            },
        }).then(function (response) {
            if (response.status == 200) {
                $scope.listForecast7Days = response.data.list;
                console.log("list forecast 7 days: ", $scope.listForecast7Days);
            } else {
                console.log("Call API dự báo 7 ngày bị lỗi");
            }
        });
        return promise;
    }

    $scope.InfoWeather = {};
    $scope.CurrentDay = {};
    $scope.InfoLocal = {};
    var initForecastDay = function () {
        var promise = $http({
            method: 'GET',
            url: apiUrlWeatherAPI,
            headers: {
                'Content-type': ' application/json'
            },
        }).then(function (response) {
            console.log("forecast day: ", response);

            if (response.status == 200) {
                $scope.CurrentDay = response.data.current;
                $scope.InfoLocal = response.data.location;
                $scope.InfoWeather = response.data.forecast.forecastday[0];
            } else {
                console.log("Call API lấy dữ liệu trực tiếp");
            }
        });
        return promise;
    }

    
    var initMain = function () {
        initForecast7Days();
        initForecastDay();
    }
    initMain();

});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, modalContent) {
    $scope.activeTab = 'chart1'; // Thiết lập tab mặc định

    // Hàm để thiết lập tab hoạt động
    $scope.setActiveTab = function(tab) {
        $scope.activeTab = tab;

        // Vẽ biểu đồ tương ứng khi tab được chọn
        if (tab === 'chart1') {
            drawChart1();
        } else if (tab === 'chart2') {
            drawChart2();
        }
    };
    

    function drawChart1() {
        var ctx = document.getElementById('chart1Canvas');
       
        
        

        var temperatureData = [
            { hour: "00:00", temperature: 20 },
            { hour: "01:00", temperature: 19 },
            { hour: "02:00", temperature: 18 },
            { hour: "03:00", temperature: 18 },
            { hour: "04:00", temperature: 17 },
            { hour: "05:00", temperature: 17 },
            { hour: "06:00", temperature: 16 },
            { hour: "07:00", temperature: 16 },
            { hour: "08:00", temperature: 17 },
            { hour: "09:00", temperature: 18 },
            { hour: "10:00", temperature: 20 },
            { hour: "11:00", temperature: 22 },
            { hour: "12:00", temperature: 24 },
            { hour: "13:00", temperature: 25 },
            { hour: "14:00", temperature: 26 },
            { hour: "15:00", temperature: 26 },
            { hour: "16:00", temperature: 25 },
            { hour: "17:00", temperature: 24 },
            { hour: "18:00", temperature: 23 },
            { hour: "19:00", temperature: 22 },
            { hour: "20:00", temperature: 21 },
            { hour: "21:00", temperature: 20 },
            { hour: "22:00", temperature: 19 },
            { hour: "23:00", temperature: 19 }
        ];

        // Extracting hours and temperatures from the data
        var hours = temperatureData.map(data => data.hour);
        var temperatures = temperatureData.map(data => data.temperature);
        if (ctx) {
            ctx = ctx.getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: hours,
                    datasets: [{
                        label: 'Temperature (°C)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        data: temperatures,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false
                            }
                        }]
                    }
                }
            });
        }
       
    }

    // Hàm để vẽ biểu đồ 2
    function drawChart2() {
        var labels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
        var data1 = [20, 22, 25, 28, 30, 28, 25, 22]; // Dữ liệu nhiệt độ cho danh sách 1
        var data2 = [18, 20, 23, 25, 28, 26, 23, 20]; // Dữ liệu nhiệt độ cho danh sách 2


        var ctx = document.getElementById('chart2Canvas').getContext('2d');
        var temperatureChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nhiệt độ thực tế',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: data1
                }, {
                    label: 'Nhiệt độ dự báo',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    data: data2
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    $scope.modalContent = modalContent;

    $scope.ok = function () {
        $uibModalInstance.close(/* data nếu cần trả về */);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
     $scope.init = function() {
        $scope.setActiveTab('chart1');
            drawChart1();
        };

   

    
});