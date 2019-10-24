const countdownto = new Date('8/17/2019 16:00:00');

function describeArc(x, y, radius, startAngle, endAngle) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].
    join(" ");

    return d;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function updateCount(){
    const date1 = new Date();
    var diffTime = countdownto.getTime() - date1.getTime();

    var diffDays = parseInt(diffTime / (1000 * 60 * 60 * 24));
    $("#daysNumber").html(diffDays);
    diffTime -= diffDays * (1000 * 60 * 60 * 24);
    while(diffDays > 30){
        diffDays -= 30;
    }
    $("#daysSVG").attr("d",describeArc(50, 50, 48, 0, 360*(1-diffDays/30) ));

    var diffHours = parseInt(diffTime / (1000 * 60 * 60));
    $("#hoursNumber").html(diffHours);
    diffTime -= diffHours * (1000 * 60 * 60);
    while(diffHours > 24){
        diffHours -= 24;
    }
    $("#hoursSVG").attr("d",describeArc(50, 50, 48, 0, 360*(1-diffHours/24) ));

    var diffMinutes = parseInt(diffTime / (1000 * 60));
    $("#minutesNumber").html(diffMinutes);
    diffTime -= diffMinutes * (1000 * 60);
    while(diffMinutes > 60){
        diffMinutes -= 60;
    }
    $("#minutesSVG").attr("d",describeArc(50, 50, 48, 0, 360*(1-diffMinutes/60) ));

    var diffSeconds = parseInt(diffTime / (1000));
    $("#secondsNumber").html(diffSeconds);
    diffTime -= diffSeconds * (1000);
    while(diffSeconds > 60){
        diffSeconds -= 60;
    }
    $("#secondsSVG").attr("d",describeArc(50, 50, 48, 0, 360*(1-diffSeconds/60) ));


}

window.setInterval(function(){
    updateCount();
}, 1000);
