
const doSomething = (name = "no value", age = "no value") =>
{
    console.log(`${name} ${age}`);
}

doSomething("Jon Snow", 40);         // Jon Snow 40
doSomething("Jon Snow");             // Jon Snow no value
doSomething();                       // no value no value
doSomething(undefined, 40);          // no value 40
doSomething("Jon Snow", undefined);  // Jon Snow no value
