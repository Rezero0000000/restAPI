import {ContactTest, UserTest} from "./test-util";
import {logger} from "../src/application/logging";
import {web} from "../src/application/web";
import supertest from "supertest"; 

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create()
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('should able to create new contact', async () => {
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

    
    it('should fail if data invalid', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "rei")
            .send({
                first_name : "Rei",
                last_name: "kun",
                email: "rei@example.com",
                phone: "777777777777777777777777777777777777777777777777777"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
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

    it ("Should be able to get contact", async () => {

        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "rei")

        logger.debug(response.body);
        expect(response.status).toBe(200);
    })

    it ("Should be faile if data not found", async () => {

        const contact = await ContactTest.get();
        const response = await supertest(web)
        .get(`/api/contacts/${contact.id + 1}`)
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


    it ("Should be able to update contact", async () => {

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

        logger.debug(response.body);
        expect(response.status).toBe(200);
    })

    
    it ("Should be fail if data invalid", async () => {

        const contact = await ContactTest.get();
        const response =await supertest(web)
        .put(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "rei")
        .send({
            first_name: "",
            last_name: "",
            email: "",
            phone: ""
        })

        logger.debug(response.body);
        expect(response.status).toBe(400);
    })
});

describe ("DELETE /api/contacts/:contactId", function() :void {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it ("Should be success to remove contact", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .delete(`/api/contacts/${contact.id}`)
        .set("X-API-TOKEN", "rei");

        logger.debug(response.body);
        expect(response.status).toBe(200);
    });

    it ("Should be reject if data not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
        .delete(`/api/contacts/${contact.id + 1}`)
        .set("X-API-TOKEN", "rei");

        logger.debug(response.body);
        expect(response.status).toBe(404);
    });
});