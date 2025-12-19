interface ActionStrategy {
    execute(): void;
}
const LIST_STRATEGIES = ["StrategieA", "StrategieB"] as const;
type TypesStrategy = typeof LIST_STRATEGIES[number];

// 1. Les implémentations concrrètes
class StrategieA implements ActionStrategy {
    private readonly nom: string;
    constructor(nom: string = "A par défaut") {
        this.nom = nom;
    }
    execute(): void {
        console.log(`C'est la StrategieA, traitant pour : ${this.nom}`);
    }
}
class StrategieB implements ActionStrategy {
    private readonly paramSpecifique: number;
    constructor(paramSpecifique: number = 42) {
        this.paramSpecifique = paramSpecifique;
    }
    execute(): void {
        console.log(`C'est la StrategieB, avec le paramètre : ${this.paramSpecifique}`);
    }
}

// 2. Le mapping
type StrategyArgsMap = {
    StrategieA: [string];
    StrategieB: [number];
};
type SpecificStrategyConstructor<K extends TypesStrategy> = new (...args: StrategyArgsMap[K]) => ActionStrategy;
const STRATEGY_MAP: {
    [K in TypesStrategy]: SpecificStrategyConstructor<K>;
} = {
    "StrategieA": StrategieA,
    "StrategieB": StrategieB,
};

type StrategyConfigFor<K extends TypesStrategy> = {
    type: K;
    constructorArgs: StrategyArgsMap[K]; 
};

// Type final de configuration
type StrategyConfig = 
    | StrategyConfigFor<"StrategieA">
    | StrategyConfigFor<"StrategieB">;

class Context {
    private config: StrategyConfig;
    constructor(config?: StrategyConfig) {
        const defaultStrategyConfig: StrategyConfigFor<"StrategieA"> = {
            type: "StrategieA",
            constructorArgs: ["Contexte par défaut"] 
        };
        this.config = config ?? defaultStrategyConfig;
    }
    public setStrategy(config: StrategyConfig) {
        this.config = config;
    }
    executeStrategy(): void {
        console.log(`Je choisis la strategy: ${this.config.type}`);
        const StrategyClass = STRATEGY_MAP[this.config.type];
        if (!StrategyClass) throw new Error(`Stratégie inconnue: ${this.config.type}`);
        
        const strategyInstance: ActionStrategy = new (StrategyClass as any)(...this.config.constructorArgs);
        strategyInstance.execute();
    }
}

// DEMO sans paramètre
const demo1 = new Context();
demo1.executeStrategy(); 

// Avec une config
const configA: StrategyConfigFor<"StrategieA"> = {
    type: "StrategieA",
    constructorArgs: ["UtilisateurAdmin"]
};
const demo2 = new Context(configA);
demo2.executeStrategy();

// Avec un settings
demo2.setStrategy({
    type: "StrategieB",
    constructorArgs: [42]
});
demo2.executeStrategy();
