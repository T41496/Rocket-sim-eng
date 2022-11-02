import vector from "./vector"
import Environment from "./environment";
import * as THREE from 'three'


export default class Rocket {

    constructor() {
        this.position = vector.create(0, 0, 0)
        this.velocity = vector.create(0, 0, 0) // start from rest
        this.acceleration = vector.create(0, 0, 0) // start from rest


        // vectors in three js formulas
        this._posVec = new THREE.Vector3(this.position.x, this.position.y, this.position.z)
        this._veloVec = new THREE.Vector3(this.velocity.getX(), this.velocity.getY(), this.velocity.getZ())
        this._accVec = new THREE.Vector3(this.acceleration.getX(), this.acceleration.getY(), this.acceleration.getZ())

        this.rocket_length = 10
        this.drag = vector.create(0, 0, 0) // drag vector

        this.ang_acc = 0
        this.ang_velo = 0
        this.ang = 0

        // for engine properties
        this.thrust = 9.5 // in a million newtons
        this.mass_flow_rate = 30 // in kg/s
        this.nozzle_angle = 0

        this.radius = 3
        this.height = 0
        this.rocket_mass = 150
        this.fuel_mass = 700
        this.total_mass = (this.rocket_mass + this.fuel_mass) * Math.pow(10, 3)
        this.burnout_time = 0

        // For rocket controlling
        this.engine_running = false

        this.drag_enabled = false
        this.gravity_enabled = false
            // For debugging purposes
        this.gravity_acc = 9.81
        this.environmet = new Environment(0.295)


        this.deltaTime = 0.001
            // depending on rocket type set the rocket mass flow rate
    }

    /**
     * returns the instantaneous mass of the rocket
     */
    update_total_mass() {
        if (this.total_mass > (this.rocket_mass * Math.pow(10, 3))) {
            if (this.engine_running) {
                this.total_mass -= (this.mass_flow_rate * this.deltaTime) // mass is decreasing
                    // console.log(this.total_mass)
            }
            // else {
            //     this.total_mass = (this.rocket_mass + this.fuel_mass) * Math.pow(10, 3)
            //     // console.log(this.total_mass)
            // }
        } else {
            this.total_mass = this.rocket_mass * Math.pow(10, 3)
        }
        return this.total_mass
    }

    calc_lift_force() {
        const angle = this._veloVec
            .angleTo(new THREE.Vector3(this._veloVec.x, 0, 0))
        return this.environmet.applyLift(this)
    }

    /**
     * @returns thrust force by applying thrust formula
     */
    _thrust_force() {
        // initialize thrust vector
        let thrust_vector = vector.create(0, 0, 0)

        if (this.total_mass <= this.rocket_mass * Math.pow(10, 3)) {
            return thrust_vector
        }
        // thrust formula : T = Ve * M(dot)
        const thrust_value = this.thrust * Math.pow(10, 6)
            // const exhaust_velo = thrust_value / this.mass_flow_rate

        thrust_vector.setX(thrust_value * Math.cos(this.nozzle_angle + (Math.PI / 2)))
        thrust_vector.setY(thrust_value * Math.sin(this.nozzle_angle + (Math.PI / 2)))

        // console.log(thrust_vector)
        return thrust_vector
    }

    /**
     * @returns weight force by applying gravitational formula
     */
    _weight_force() {

        // TODO: Simulate taking it as user input
        //  6.6743 × 10^-11 m^3 kg^-1 s^-2
        const uni_grav_cons = 6.6743 * Math.pow(10, -11)

        // 5.98×10^24 kg 
        const mass_of_earth = 5.98 * Math.pow(10, 24)

        // 6380 km 
        const earth_radius = 6380 * Math.pow(10, 3)

        const distance = earth_radius + this.height


        // apply formula : Fg= G * (m1 * m2) / R^2
        let weight = vector.create(0, 0, 0)
        weight.setY(-uni_grav_cons * mass_of_earth * (this.total_mass) / Math.pow(distance, 2))

        // weight.setY(-this.gravity * this.total_mass)
        this.gravity_acc = uni_grav_cons * mass_of_earth / Math.pow(distance, 2)


        return weight
    }


    calc_center_of_gravity() {

        // rocket load
        let part1_weight = this.rocket_mass * Math.pow(10, 3) * this.gravity_acc
        let part2_weight = (this.update_total_mass() - this.rocket_mass * Math.pow(10, 3)) * this.gravity_acc

        // console.log('part1: ' + part1_weight)
        // console.log('part2: ' + part2_weight)

        //cg = (w1*d + w2*d)/w
        return (part1_weight * 9 + part2_weight * 4) / (this.update_total_mass() * this.gravity_acc)
    }

    // calc_center_of_pressure() {
    //
    //     // rocket load
    //     // triangle area , 0.6 must be a percent of all length
    //     const part1_area = this.radius * 2 + 0.6 * 0.5
    //     // rectangle area (BODY) , 11.4 must be a percent of all length
    //     const part2_area = this.radius * 2 * 11.4
    //     // trapezoid area , (A+B) / 2 * h , 0.6 & 1.2 must be a percent of all width , 1 must be a percent of all length
    //     const part3_area = (0.6 + 1.2) / 2
    //
    //     const all_parts_area = part1_area + part2_area + part3_area
    //
    //     // triangle centroid , 0.6 must be a percent of all length
    //     const part1_centriod = 2 / 3 * 0.6
    //     // rectangle centroid (BODY) , 11.4 must be a percent of all length
    //     const part2_centroid = 11.4 / 2
    //     // trapezoid centroid , h/3 * (2A+B / A+B ) , 0.6 & 1.2 must be a percent of all width , 1 must be a percent of all length
    //     const part3_centroid = 1 / 3 * ((2 * 0.6 + 1.2) / (0.6 + 1.2))
    //
    //     const part1_distance = part1_centriod + part2_centroid + part3_centroid
    //     const part2_distance = part2_centroid + part3_centroid
    //     const part3_distance = part3_centroid
    //
    //     //Cp = (a1*d + a2*d)/a
    //     return (part1_area * part1_distance + part2_area * part2_distance + part3_area * part3_distance) / all_parts_area
    // }

    calc_center_of_pressure() {

        // rocket load
        // triangle area , 0.6 must be a percent of all length
        const part1_area = this.radius * 2
            // rectangle area (BODY) , 11.4 must be a percent of all length
        const part2_area = this.radius * 8
            // trapezoid area , (A+B) / 2 * h , 0.6 & 1.2 must be a percent of all width , 1 must be a percent of all length
            // const part3_area = (0.6 + 1.2) / 2

        const all_parts_area = part1_area + part2_area

        // triangle centroid , 0.6 must be a percent of all length
        const part1_centriod = 2 / 2
            // rectangle centroid (BODY) , 11.4 must be a percent of all length
        const part2_centroid = 8 / 2
            // trapezoid centroid , h/3 * (2A+B / A+B ) , 0.6 & 1.2 must be a percent of all width , 1 must be a percent of all length
            // const part3_centroid = 1 / 3 * ((2 * 0.6 + 1.2) / (0.6 + 1.2))

        const part1_distance = part1_centriod + part2_centroid
            // const part2_distance = part2_centroid
            // const part3_distance = part3_centroid

        //Cp = (a1*d + a2*d)/a
        return (part1_area * part1_distance + part2_area * part2_centroid) / all_parts_area
    }

    calc_total_torques() {
        const cog = this.calc_center_of_gravity()
        const cop = this.calc_center_of_pressure()

        // console.log('cog: ' + cog)
        // console.log('cop: ' + cop)

        const diameter = cog - cop

        // angle between position vector and velocity vector

        const alpha = this.position.getAngleXY() - this.velocity.getAngleXY()

        // angle between velocity vector and x axis
        const gama = this._veloVec.angleTo(new THREE.Vector3(this._veloVec.x, 0, 0))

        // console.log(gama)
        const lift_force = 2 * alpha * this.environmet.applyLift(this)
        const drag_force = this.environmet.applyDragA(this)


        // calculate lift torque
        const lift_torque = diameter * lift_force * Math.sin(alpha - (Math.PI / 2))
        const drag_torque = drag_force * diameter * Math.sin(alpha)

        /*Cg = (dn * wn + db * wb) / wight;   // حساب مركز الثقل
        Cp = (cpn + cpb) / area;// حساب مركز الضغط
        ct = (Cg - Cp);// المسافة بين مركز الثقل ومركز الضغط

        Lr = ct * Math.sin(a - (Math.PI / 2)) * L;   //  عزم قوة الرفع
        Dr = ct * Math.sin(a) * D;  // عزم قوة السحب

        I = 0.5 * mass * r * r; // عزم العطالة

        arr_angle = (Dr + Lr) / I;  // التسارع الزاوي

        v_angle = v_angle + arr_angle * dt;  // السرعة الزاوية الجديدة

        Q_angle = Q_angle + v_angle * dt;  // زاوية انحراف الصاروخ الجديدة*/

        const total_torques = drag_torque + lift_torque
            // console.log(total_torques)

        return total_torques
    }

    calc_moment_of_inertia() {
        return 0.5 * this.total_mass * Math.pow(this.radius, 2)

    }

    calc_ang_acc() {
        this.ang_acc = this.calc_total_torques() / this.calc_moment_of_inertia()
    }

    calc_ang_velo() {
        const ang_acc = this.ang_acc
        this.ang_velo += ang_acc * this.deltaTime
    }

    calc_ang() {
        const ang_velo = this.ang_velo
        this.ang += ang_velo * this.deltaTime
    }


    /**
     * @returns calculated rocket acceleration
     * depending on total net forces acting on the rocket
     */
    _calc_acc() {
        let net_forces = vector.create(0, 0, 0)

        const thrust = this._thrust_force()
        const weight = this._weight_force()
        const reaction = this._weight_force().multiply(-1)
        this.drag = this.environmet.applyDrag(this)

        if (this.engine_running) {
            net_forces = net_forces.add(thrust)
        }

        // console.log(drag)
        if (this.drag_enabled) {
            net_forces = net_forces.add(this.drag)
        }

        if (this.gravity_enabled) {
            net_forces = net_forces.add(weight)
        }
        if (this.height === 0 && this.gravity_enabled) {
            net_forces = net_forces.add(reaction)
        }
        // todo: add other forces

        // console.log(net_forces);
        return net_forces.multiply(1 / (this.total_mass))
    }

    /**
     * update acceleration of the rocket
     */
    _update_acceleration() {
        this.acceleration = this._calc_acc()
        this._accVec.x = this.acceleration.getX()
        this._accVec.y = this.acceleration.getY()
        this._accVec.z = this.acceleration.getZ()
    }


    /**
     * update rocket velocity by adding the acceleration
     */
    _update_velocity() {
        this.velocity = this.velocity.add(this.acceleration.multiply(this.deltaTime))
        this._veloVec.x = this.velocity.getX()
        this._veloVec.y = this.velocity.getY()
        this._veloVec.z = this.velocity.getZ()
    }

    /**
     * Update rocket position be adding the velocity
     */
    _update_position() {

        if (this.position.getY() <= 0) {
            if (this.velocity.getY() < 0) {
                this.velocity = this.velocity.multiply(0)
                this.position.setY(0)
            }
        }
        this.position = this.position.add(this.velocity.multiply(this.deltaTime))
        this._posVec.x = this.position.x
        this._posVec.y = this.position.y
        this._posVec.z = this.position.z
    }

    _update_current_height() {
        this.height = this.position.getY()
    }

    update() {
        this._update_acceleration()
        this._update_velocity()
        this._update_position()
        this.update_total_mass()
        this._update_current_height()

        this.calc_ang_acc()
        this.calc_ang_velo()
        this.calc_ang()
            //
        console.log(' ang_acc: ' + this.ang_acc)
        console.log(' ang_velo: ' + this.ang_velo)
        console.log(' ang: ' + this.ang)

        this.calc_total_torques()
        if (this.height === 0) {
            this.ang_acc = 0
            this.ang_velo = 0
        }

        if (this.engine_running) {
            this.burnout_time += this.deltaTime
        }
    }

}