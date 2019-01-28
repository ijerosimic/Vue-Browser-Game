var vm = new Vue({
    el: '#app',
    data: {
        hello: 'hello',
        menuOptions: true,
        showCombatLog: false,
        combatLog: [],
        playerTurnID: 0,
        monsterTurnID: 1,
        playerHealthBar: 100,
        monsterHealthBar: 100,
        normalAtk: 20,
        specialAtk: 35,
        healAtk: 35
    },
    methods: {
        startGame: function () {
            this.menuOptions = !this.menuOptions;
            this.showCombatLog = !this.showCombatLog;
            this.combatLog = [];
            this.playerHealthBar = 100;
            this.monsterHealthBar = 100;
        },
        attack: function () {
            this.showCombatLog = true;
            this.executeAtk('normal');
        },
        specialAttack: function () {
            this.showCombatLog = true;
            this.executeAtk('special');
        },
        healPlayer: function () {
            this.showCombatLog = true;
            this.executeHeal();
        },
        calcDmgOrHeal: function (amount) {
            return Math.ceil(Math.random() * amount);
        },
        executeAtk: function (typeOfAtk) {
            let playerAtkAmount;
            let monsterAtkAmount;

            if (typeOfAtk == 'normal') {
                playerAtkAmount = this.calcDmgOrHeal(this.normalAtk);
                monsterAtkAmount = this.calcDmgOrHeal(this.normalAtk);
            } else {
                playerAtkAmount = this.calcDmgOrHeal(this.specialAtk);
                monsterAtkAmount = this.calcDmgOrHeal(this.specialAtk);
            }

            this.logAtk(playerAtkAmount, monsterAtkAmount);
        },
        logAtk: function (playerAtkAmount, monsterAtkAmount) {
            const playerTurnID = {
                turnID: 'player-turn',
                logText: 'Player hits monster for ' + playerAtkAmount
            };

            const monsterTurnID = {
                turnID: 'monster-turn',
                logText: 'Monster hits player for ' + monsterAtkAmount
            };

            this.combatLog.unshift(playerTurnID);
            this.combatLog.unshift(monsterTurnID);

            this.lowerPlayerHealthBar(monsterAtkAmount);
            this.lowerMonsterHealthBar(playerAtkAmount);
        },
        executeHeal: function () {
            let healAmount = this.calcDmgOrHeal(this.healAtk);
            let monsterAtkAmount = this.calcDmgOrHeal(this.normalAtk);

            this.logHeal(healAmount, monsterAtkAmount);
        },
        logHeal: function (healAmount, monsterAtkAmount) {
            const playerHealthBar = this.playerHealthBar;
            let logText = 'Player heals for ' + healAmount;

            if (playerHealthBar >= 100) {
                logText = 'Heal is worthless, cannot add health above 100';
                healAmount = 0;
            }

            const playerTurnID = {
                turnID: 'player-heal',
                logText: logText
            };

            const monsterTurnID = {
                turnID: 'monster-turn',
                logText: 'Monster hits player for ' + monsterAtkAmount
            };

            this.combatLog.unshift(playerTurnID);
            this.combatLog.unshift(monsterTurnID);

            this.increasePlayerHealthBar(healAmount);
            this.lowerPlayerHealthBar(monsterAtkAmount);
        },
        lowerPlayerHealthBar: function (monsterAtkAmount) {
            this.playerHealthBar = this.playerHealthBar - monsterAtkAmount;
        },
        lowerMonsterHealthBar: function (playerAtkAmount) {
            this.monsterHealthBar = this.monsterHealthBar - playerAtkAmount;
        },
        increasePlayerHealthBar: function (healAmount) {
            this.playerHealthBar = this.playerHealthBar + healAmount;
        },
        gameOverPrompt: function (result) {
            let retVal = confirm(result + "\nNew game ?");
            if (retVal == true) {
                this.startGame();
                this.playerHealthBar = 100;
                this.monsterHealthBar = 100;
            } else {
                return false;
            }
        }
    },
    computed: {
        playerHealthBarWidth: function () {
            return {
                width: this.playerHealthBar + '%'
            };
        },
        monsterHealthBarWidth: function () {
            return {
                width: this.monsterHealthBar + '%'
            };
        },
    },
    watch: {
        playerHealthBar: function () {
            if (this.playerHealthBar <= 0) {
                this.gameOverPrompt('You lost!');
            }
        },
        monsterHealthBar: function () {
            if (this.monsterHealthBar <= 0) {
                this.gameOverPrompt('You won!');
            }
        }
    }
});