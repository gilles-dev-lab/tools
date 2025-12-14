function LogClass(target: Function) {
    console.log(`Class Decorator called for: ${target.name}`);
}
function Injectable() {
    return function (constructor: Function) {
        Reflect.defineMetadata('injectable', true, constructor);
    };
}
function LogMethod(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with arguments:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result of ${propertyKey}:`, result);
        return result;
    };

    return descriptor;
}

/*
@Injectable()
@LogClass
class ExampleClass {
    constructor() {
        console.log("ExampleClass instantiated");
    }
    @LogMethod
    add(a: number, b: number): number {
        return a + b;
    }
}

const demo = new ExampleClass()
console.log(Reflect.getMetadata('injectable', ExampleClass)); // true
demo.add(2, 3);
*/
