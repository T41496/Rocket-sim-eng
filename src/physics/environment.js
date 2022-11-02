export default class Environment {


    constructor(drag_coefficient) {
        this.drag_coefficient = drag_coefficient
    }


    calc_temp(height) {
        if (height > 25000) {
            // console.log('height: ' + height)
            return -131.21 + 0.00299 * height
        } else if (height >= 11000 && height <= 25000) {
            // console.log('height: ' + height)
            return -56.06
        } else if (height < 11000) {
            // console.log('height: ' + height)
            return 15.04 - 0.00649 * height
        }
    }

    calc_pressure(height, temp, gravity) {
        const p0 = 101325 //pascal
        const R = 8.31446 // J.mol^-1.K^-1
        const molecular_mass = 0.0286944 // Kg/mol

        // console.log('temp: ' + temp)
        return p0 * Math.exp((-molecular_mass * gravity * height) / (R * temp))

    }

    calc_density(pressure, temp) {
        const Rspec = 287.0500676
        return pressure / (temp * Rspec)
    }

    calc_area(radius) {
        return Math.pow(radius, 2) * Math.PI
    }

    applyDrag(rocket) {
        let temp = this.calc_temp(rocket.height) + 273.15
        let pressure = this.calc_pressure(rocket.height /** 0.01*/ , temp, rocket.gravity_acc)
        let density = this.calc_density(pressure, temp)
        let sqrvelo = rocket.velocity.square()
            // console.log(sqrvelo)
        let area = this.calc_area(rocket.radius)
        let velo_unit = rocket.velocity.normalize()
        let drag = -0.5 * sqrvelo * density * area * this.drag_coefficient
        return velo_unit.multiply(drag)
    }

    applyDragA(rocket) {
        let temp = this.calc_temp(rocket.height) + 273.15
        let pressure = this.calc_pressure(rocket.height, temp, rocket.gravity_acc)
        let density = this.calc_density(pressure, temp)
        let sqrvelo = rocket.velocity.square()
            // console.log(sqrvelo)
        let area = this.calc_area(rocket.radius)
        return 0.5 * sqrvelo * density * area * this.drag_coefficient // TODO: to be modified
    }

    applyLift(rocket) {
        let temp = this.calc_temp(rocket.height) + 273.15
        let pressure = this.calc_pressure(rocket.height, temp, rocket.gravity_acc)
        let density = this.calc_density(pressure, temp)
        let sqrvelo = rocket.velocity.square()
            // console.log(sqrvelo)
        let area = this.calc_area(rocket.radius)

        return 0.5 * density * sqrvelo * area * this.drag_coefficient
    }

}