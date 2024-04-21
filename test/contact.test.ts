import {ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create()
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should create new contact', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "rei")
            .send({
                first_name : "Rei",
                last_name: "kun",
                email: "rei@example.com",
                phone: "0899999"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Rei");
        expect(response.body.data.last_name).toBe("kun");
        expect(response.body.data.email).toBe("rei@example.com");
        expect(response.body.data.phone).toBe("0899999");
    });

    
    it('should rejected if token wrong', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "salah")
            .send({
                first_name : "Rei",
                last_name: "kun",
                email: "rei@example.com",
                phone: "0899999"
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe ("GET /api/contacts/:contactId", function()  :void {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it ("Should be success get contact", async () => {

        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "rei")

        logger.debug(response.body);
        expect(response.status).toBe(200);
    })

    it ("Should be failed if token invalid", async () => {

        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "salah")

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })
})

describe ("PUT /api/contacts/:contactId", function()  :void {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });


    it ("Should be success update contact", async () => {

        const contact = await ContactTest.get();
        const response =await supertest(web)
        .put(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "rei")
        .send({
            first_name: "eko",
            last_name: "khannedy",
            email: "eko@example.com",
            phone: "9999"
        })

        expect(response.status).toBe(200);
    })
})