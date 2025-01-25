var module = rise.registerModule("miniblox fly", "fly??");


module.registerSetting("number", "Speed", 1, 1, 10);
var blinkModule = module.registerSetting("boolean", "Blink", true);
var smoothCam = module.registerSetting("boolean", "Smooth Camera", true);

if(smoothCam) render.smoothCamera();

var blinkTimer = 0;

script.handle("onUnload", function () {
    module.unregister();
});

module.handle("onPreMotion", function (e) {
    var motionY = player.getMotion().getY();
    var playerPosY = player.getPosition().getY();
    var calculateMotion = -(playerPosY - Math.floor(playerPosY));

    e.setOnGround(true);

    if (motionY <= 0) {
        player.setMotionY(0.42);
    } else if (motionY > 0) {
        player.setMotionY(calculateMotion); // stabilize 
    }

    if(input.isKeyBindJumpDown()){
        player.setMotionY(1);
        module.setSetting("Smooth Camera", false);
    } else if(!input.isKeyBindJumpDown()){
        module.setSetting("Smooth Camera", true);
    }

    if(input.isKeyBindSneakDown()){
        player.setMotionY(-1);
        module.setSetting("Smooth Camera", false);
    } else if(!input.isKeyBindSneakDown()){
        module.setSetting("Smooth Camera", true);
    }

    if(blinkModule){
        if (blinkTimer >= 40) {
            rise.dispatch(); 
            blinkTimer = 0; 
        } else if (blinkTimer === 20) {
            rise.blink(); 
        }
    
        blinkTimer++; 
    }
});

module.handle("onGame", function() {
    if (player.getFallDistance() > 2) {
        var pos = player.getPosition();
        player.setPosition(pos.getX(), pos.getY() + 0.1, pos.getZ());
        player.isOnGround = true
    }
})

module.handle("onStrafe", function (e) {
    e.setSpeed(module.getSetting("Speed"));
    rise.dispatch();
    return e;
});

module.handle("onDisable", function () {
    rise.dispatch();
    player.setMotion(0,0,0);
});