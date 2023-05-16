// Вычислительная реализация
// 1 - Метод половинного деления
// 2 - Метод хорд
// 5 - Метод простых итераций 
// Программная реализация задачи
// нелинейное уравнение
// 1 - Метод половинного деления
// 4 - Метод секущих
// 5 - Метод простой итераций 
// система нелинейных уравнений
// 7 - Метод простой итерации

let ACCURACY = 0.01
const FIRST_N = 4
let interval_ogr = [1,2]
let table = [[1.2, 7.4], [2.9, 9.5], [4.1, 11.1], [5.5, 12.9], [6.7, 14.6], [7.8, 17.3], [9.2, 18.2], [10.3, 20.7]] // [x,y]
let table_1 = [[1.1 , 3.5], [ 2.3, 4.1], [3.7, 5.2], [4.5, 6.9], [5.4, 8.3], [6.8, 14.8], [7.5, 21.2]] // kv
let table_exp = [[1, 2.1], [2, 6.2], [3, 13.3], [4, 24.6], [5, 117.5]]
let test = [[1.1, 2.73], [2.3, 5.12], [3.7, 7.74], [4.5, 8.91], [5.4, 10.59], [6.8, 12.75], [7.5, 13.43]]
function middle_square_linear(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += table[i][1] 
        SXY += table[i][0] * table[i][1]
    }
    let a = (SXY * n - SX * SY) / (SXX * n - SX * SX)
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    let eps = []
    let S = 0

    for (let i = 0; i < n; i++) {
        let f_i = a*table[i][0] + b
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i)  
    }
    let dev = Math.sqrt(S/n)
    console.warn("Линейная функция: fx = " + a + "*x + " + b)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
}

function middle_square_quad(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SXXX = 0
    let SXXXX = 0
    let SY = 0
    let SXY = 0
    let SXXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += table[i][1] 
        SXY += table[i][0] * table[i][1]
        SXXX += Math.pow(table[i][0], 3)
        SXXXX += Math.pow(table[i][0], 4)
        SXXY += Math.pow(table[i][0], 2) * table[i][1]
    }
    matrix = [[n, SX, SXX, SY], [SX, SXX, SXXX, SXY], [SXX, SXXX, SXXXX, SXXY]]
    let [a0, a1, a2] = gauss(matrix)

    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = a2*table[i][0]*table[i][0] + a1*table[i][0] + a0
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i)  
    }
    let dev = Math.sqrt(S/n)
    console.warn("Квадратная функция: fx = " + a2 + "*x^2 + " + a1 + "*x + " + a0)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    
}

function log_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += Math.log(table[i][0])
        SXX += Math.log(table[i][0]) * Math.log(table[i][0])
        SY += table[i][1] 
        SXY += Math.log(table[i][0]) * table[i][1]
    }
    let a = (SXY * n - SX * SY) / (SXX * n - SX * SX)
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = a*Math.log(table[i][0]) + b
        let eps_i = f_i - table[i][1]
        S += eps_i * eps_i
        eps.push(f_i - table[i][1])   
        table[i].push(f_i, eps_i)     
    }
    let dev = Math.sqrt(S/n)
    console.warn("Логарифмическая функция: fx = " + a + "ln(x) + " + b)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
}

function exp_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += Math.log(table[i][1]) 
        SXY += table[i][0] * Math.log(table[i][1])
    }
    
    let a = ((SXY * n - SX * SY) / (SXX * n - SX * SX))
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    
    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = Math.exp(b)*Math.exp(a*table[i][0])
        let eps_i = f_i - table[i][1]
        table[i].push(f_i, eps_i)
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
    }
    
    
    let dev = Math.sqrt(S/n)
    console.warn("Экспоненциальная функция: fx = " + Math.exp(b) + "*e^(" + a + "*x)")
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)}


function power_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += Math.log(table[i][0])
        SXX += Math.log(table[i][0]) * Math.log(table[i][0])
        SY += Math.log(table[i][1])
        SXY += Math.log(table[i][0]) * Math.log(table[i][1])

    }
    
    let a = ((SXY * n - SX * SY) / (SXX * n - SX * SX))
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    let eps = []
    let S = 0

    for (let i = 0; i < n; i++) {
        let f_i = Math.exp(b)*Math.pow(table[i][0], a) 
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i) 
    }
    let dev = Math.sqrt(S/n)
    console.warn("Степенная функция: fx = "+ Math.exp(b) +"*x^" + a)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)}
 
function gauss(matrix) {
    for (let i = 0; i < matrix.length - 1; i++) {
        let max = i
        for (let m = i + 1; m < matrix.length; m++) {
            if (matrix[m][i] > matrix[max][i]) {
                max = m;
            }
        }
        if (max != i) {
            for (let j = 0; j <= matrix.length; j++) {
                let c = matrix[i][j];
                matrix[i][j] = matrix[max][j];
                matrix[max][j] = c;
            }
        }
        for (let k = i + 1; k < matrix.length; k++ ) {
            let multiplier = matrix[k][i] / matrix[i][i];
            for (let j = i; j <= matrix.length; j++) {
                matrix[k][j] -= multiplier * matrix[i][j];
            }
        }
        
    }
    let solutions = []
    for (let i = matrix.length - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < matrix.length; j++) {
            sum += matrix[i][j] * solutions[j];
        }
        solutions[i] = (matrix[i][matrix.length] - sum) / matrix[i][i];
    }
    return solutions
}
power_aprox(test)
exp_aprox(test)
log_aprox(test)
middle_square_linear(test)
middle_square_quad(test)


// производная
function first_derivative(func, x, dx) {
    dx = dx || 0.00000001

    return (func(x + dx) - func(x))/dx
}

function f1(x) {

    return Math.pow(x,3) - 9*x - 8
}

function f2(x) {

    return Math.log(x)
}

function f3(x) {

    return x*x + 3.22 * x - 1.11
}

function f4(x) {

    return x * x
}


function F1(x) {
   return x**4/4 - (9/2) * (x ** 2) - 8 * x
}

function F2(x) {
    return x*Math.log(x) - x
}
 
function F3(x) {
    return (x**3)/3 + (3.22/2) * (x**2) - 1.11*x
}

function F4(x) {
    return x**3/3
}


let main_func = f1
let main_F = f1



// Метод прямоугольников
function square_method(func, interval, total_iterations) {
    function right(func, interval, total_iterations) {
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_i = interval[0] + step
            while (i < total_iterations) {
                sum_1 += func(x_i)
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_i = interval[0] + step
            while (i < total_iterations * 2) {
                sum_2 += func(x_i)
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            if (R <= ACCURACY) {
                final_sum = sum_2
                total_iterations *= 2
                break
            }
            total_iterations *= 2
        }
        
        
        return [final_sum, total_iterations]
    }

    function left(func, interval, total_iterations) {
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_i = interval[0]
            while (i < total_iterations) {
                sum_1 += func(x_i)
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_i = interval[0]
            while (i < total_iterations * 2) {
                sum_2 += func(x_i)
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            total_iterations *= 2
            if (R <= ACCURACY) {
                final_sum = sum_2
                break
            }
        }
        
        
        return [final_sum, total_iterations]
    }

    function middle(func, interval, total_iterations) {    
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_prev = interval[0]
            let x_i = x_prev + step
            while (i < total_iterations) {
                let x_mid = (x_i + x_prev) / 2
                sum_1 += func(x_mid)
                x_prev = x_i
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_prev = interval[0]
            x_i = x_prev + step
            while (i < total_iterations * 2) {
                let x_mid = (x_i + x_prev) / 2
                sum_2 += func(x_mid)
                x_prev = x_i
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            total_iterations *= 2
            if (R <= ACCURACY) {
                final_sum = sum_2
                break
            } 
        }
        
        
        return [final_sum, total_iterations]
    }
    
    
    console.warn("Метод прямоугольников (Правый):")
    console.log("Значение интеграла: " + right(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + right(main_func, interval_ogr, 4)[1])
                console.log(main_F(interval_ogr[1]) - main_F(interval_ogr[0]))
    console.log("--------")
    console.warn("Метод прямоугольник (Серединный):")
    console.log("Значение интеграла: " + middle(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + middle(main_func, interval_ogr, 4)[1])
    console.log("--------")
    console.warn("Метод прямоугольник (Левый):")
    console.log("Значение интеграла: " + left(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + left(main_func, interval_ogr, 4)[1])
    console.log("--------")

}

// Метод трапеций
function trapeze_method(func, interval, total_iterations) {
    let R = 1
    let final_sum
    while (true) {
        let step = (interval[1] - interval[0])/total_iterations
        let sum_1 = 0
        let i = 0
        let x_i = interval[0] + step
        while (i < total_iterations - 1) {
            sum_1 += func(x_i)
            x_i += step
            i++
        }
        sum_1 = step * (sum_1 + (func(interval[0]) + func(interval[1]))/2)
        
        i = 0
        step = (interval[1] - interval[0])/(total_iterations * 2)
        let sum_2 = 0
        x_i = interval[0] + step
        while (i < total_iterations * 2) {
            sum_2 += func(x_i)
            x_i += step
            i++
        }
        sum_2 = step * (sum_2 + (func(interval[0]) + func(interval[1]))/2)
        R = Math.abs(sum_1 - sum_2)
        total_iterations *= 2
        if (R <= ACCURACY) {
            final_sum = sum_2
            break
        }
    }

    return [final_sum, total_iterations]
}

function simpson_method(func, interval, total_iterations) {
    let R = 1
    let final_sum
    while (true) {
        let step = (interval[1] - interval[0])/total_iterations
        let sum_1
        let even_sum = 0
        let odd_sum = 0
        let i = 1
        let x_i = interval[0]
        while (i < total_iterations) {
            if (i % 2 == 0) {
                odd_sum += func(x_i)
            } else {
                even_sum += func(x_i)
            }
            x_i += step
            i++
        }
        sum_1 = (step/3) * (func(interval[0]) + 2 * odd_sum + 4 * even_sum + func(x_i))

        even_sum = 0
        odd_sum = 0
        i = 0
        step = (interval[1] - interval[0])/(total_iterations * 2)
        let sum_2 = 0
        x_i = interval[0]
        while (i < total_iterations * 2) {
            if (i % 2 == 0) {
                odd_sum += func(x_i)
            } else {
                even_sum += func(x_i)
            }
            x_i += step
            i++
        }
        sum_2 = (step/3) * (func(interval[0]) + 2 * odd_sum + 4 * even_sum + func(x_i))
        R = Math.abs(sum_1 - sum_2)
        total_iterations *= 2
        if (R <= ACCURACY) {
            final_sum = sum_2
            break
        }
    }
    
    return [final_sum, total_iterations]
}








function startAll(func) {
    console.clear()
    square_method(func, interval_ogr, FIRST_N)
    console.warn("Трапеция:")
    console.log("Значение интеграла: " + trapeze_method(func, interval_ogr, FIRST_N)[0]
                + "\t Число разбиения: " + trapeze_method(func, interval_ogr, FIRST_N)[1])
    console.log("--------")
    console.warn("Симпсон:")
    console.log("Значение интеграла: " + simpson_method(func, interval_ogr, FIRST_N)[0]
                + "\t Число разбиения: " + simpson_method(func, interval_ogr, FIRST_N)[1])

}




// // ******************************************************** 

document.getElementById("accuracy").addEventListener("change" ,(e) => {
    ACCURACY = Number(e.target.value)
})

document.getElementById("a0").addEventListener("change", (e) => {
    interval_ogr[0] = Number(e.target.value)
})

document.getElementById("b0").addEventListener("change", (e) => {
    interval_ogr[1] = Number(e.target.value)
})


document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(main_func)
})


document.querySelectorAll(".func").forEach((element) => element.addEventListener("click", (e) => {
    
    switch(e.target.defaultValue) {
        case "1":
            main_func = f1
            main_F = F1
            break
        case "2":
            main_func = f2
            main_F = F2
            break
        case "3":
            main_func = f3
            main_F = F3
            break
        case "4":
            main_func = f4
            main_F = F4
            break

    }
    graph()
}))




const canvas = document.querySelector("canvas")
const WIDTH = 600
const HEIGHT = 600
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const MULTIPLY = 40

function graph() {
    const ctx = canvas.getContext("2d")
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    render_coordinates()
    render_graph(main_func)    
}
graph()


function render_unlinear_graph(system) {
    const ctx = canvas.getContext("2d")
    for (let i = 0; i <= system().length; i++) {
        i % 2 == 0 ? ctx.strokeStyle = "green" : ctx.strokeStyle = "blue"
    
        ctx.beginPath()
        ctx.lineWidth = 3
        
        for (let x = -20; x < 15; x+=0.0001) {       
            ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (system(x)[i] * MULTIPLY))
        }
        ctx.stroke()
        ctx.closePath()
    }
    
    // ctx.beginPath()
    // ctx.strokeStyle = "blue"
    // ctx.lineWidth = 3
    // for (let x = -15; x < 10; x+=0.0001) {
    //     ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (system(x)[0] * MULTIPLY))
    // }
    // ctx.stroke()
    // ctx.closePath()
}



function render_graph(func) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.lineWidth = 3
    for (let x = -DPI_WIDTH/2; x < DPI_WIDTH/2; x+=0.2) {
        ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (func(x) * MULTIPLY))
    }
    ctx.stroke()
    ctx.closePath()
}

function render_coordinates() {
    const ctx = canvas.getContext("2d")
    ctx.moveTo(DPI_WIDTH, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH - 30, DPI_HEIGHT/2 - 10)
    ctx.moveTo(DPI_WIDTH, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH - 30, DPI_HEIGHT/2 + 10)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2 + 10, 30)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2 - 10, 30)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2, DPI_HEIGHT)
    ctx.moveTo(0, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH, DPI_HEIGHT/2)
    
    ctx.font = " bold 15pt Courier"
    for (let i = 50; i < DPI_HEIGHT; i += 50) {
        ctx.moveTo(DPI_WIDTH/2 - 12, i)
        ctx.lineTo(DPI_WIDTH/2 + 12, i)
        ctx.fillText(Math.round((50*12/MULTIPLY) - i/MULTIPLY), DPI_WIDTH/2, i)
    }

    for (let i = 50; i < DPI_WIDTH; i += 50) {
        ctx.moveTo(i, DPI_HEIGHT/2 - 12)
        ctx.lineTo(i, DPI_HEIGHT/2 + 12)
        ctx.fillText(-Math.round((50*12/MULTIPLY) - i/MULTIPLY), i , DPI_HEIGHT/2)
    }
    ctx.stroke()
}