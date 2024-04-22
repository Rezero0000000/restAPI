import { logger } from "../src/application/logging";
import {web} from "../src/application/web"
import { UserTest } from "./test-util";
import supertest from "supertest"
import bcrypt from "bcrypt"

describe ("POST /api/users", function () :void {
    afterEach (async () => {
        await UserTest.delete();
    });

    it ("Should be failed registation", async () => {
        const response = await supertest(web)
        .post("/api/users")
        .send({
            name: "",
            username: "",
            password: ""
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it ("Should be duplicate data error", async () => {
        const response =  await supertest(web)
        .post("/api/users")
        .send({
            name: "rezero",
            username: "rezero",
            password: "rezero"
        });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it ("Should be able to registation", async () => {
        const response =  await supertest(web)
        .post("/api/users")
        .send({
            name: "rei",
            username: "rei",
            password: "rei"
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("rei");
        expect(response.body.data.username).toBe("rei");
    });
});



describe ("POST /api/users/login", function() :void {

    beforeEach (async () => {
        await UserTest.create()
    })
    afterEach (async () => {
        await UserTest.delete();
    });
 
    it ("Should be able to login", async () => {
        const response = await supertest(web)
        .post("/api/users/login")
        .send({
            username: "rei",
            password: "rei"
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("rei");
        expect(response.body.data.username).toBe("rei");
        expect(response.body.data.token).toBeDefined();
    });

    it ("Should be reject if password is wrong", async () => {
        const response = await supertest(web)
        .post("/api/users/login")
        .send({
            username: "rei",
            password: "salah"
        });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    
    it ("Should be reject if username is wrong", async () => {
        const response = await supertest(web)
        .post("/api/users/login")
        .send({
            username: "salah",
            password: "rei"
        });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

});



describe ("GET /api/users/current", function() :void {    

    beforeEach (async () => {
        await UserTest.create()
    })
    afterEach (async () => {
        await UserTest.delete();
    });

    it ("Should be able to get current user", async () => {
        const response = await supertest(web)
        .get("/api/users/current")
        .set("X-API-TOKEN", "rei")
        

        logger.debug(response.body);
        expect(response.status).toBe(200);
        console.log(response.body.data)
        expect(response.body.data.name).toBe("rei");
        expect(response.body.data.username).toBe("rei");
    })

    it ("Should be fail to get current user", async () => {
        const response = await supertest(web)
        .get("/api/users/current")
        .set("X-API-TOKEN", "salah")

        logger.debug(response.body);
        expect(response.status).toBe(401);
    })
});



describe ("PATCH /api/users/current/", function() :void {
    beforeEach (async () => {
        await UserTest.create()
    })
    afterEach (async () => {
        await UserTest.delete();
    });

    it ("Should be able to update user name", async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("X-API-TOKEN", "rei")
        .send({ 
            name: "LOL"
        })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("LOL")
    });

    it ("Should be reject to update user if token wrong ", async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("X-API-TOKEN", "salah")
        .send({ 
            name: "LOL",
            password: "LOL"
        })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it ("Should be able to update user name ", async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("X-API-TOKEN", "rei")
        .send({ 
            name: "LOL",
        })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("LOL");
    });

    it ("Should be able to update user password ", async () => {
        const response = await supertest(web)
        .patch("/api/users/current")
        .set("X-API-TOKEN", "rei")
        .send({ 
            password: "LOL",
        });

        logger.debug(response.body);
        expect(response.status).toBe(200);

        const user = await UserTest.get();
        expect(await bcrypt.compare("LOL", user.password)).toBe(true);

    });
})


describe ("DELETE /api/users/current/logout", function() :void {
    beforeEach (async () => {
        await UserTest.create()
    })
    afterEach (async () => {
        await UserTest.delete();
    });

    it ("Should be able to logout", async () => {
        const response = await supertest(web)
        .delete("/api/users/current/logout")
        .set("X-API-TOKEN", "rei");

        logger.debug(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();

        const user = await UserTest.get();
        expect(user.token).toBeNull();
    });

    it ("Should be rejecte if token invalid", async () => {
        const response = await supertest(web)
        .delete("/api/users/current/logout")
        .set("X-API-TOKEN", "salah");

        logger.debug(response.body)
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});