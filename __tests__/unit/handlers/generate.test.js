
const lambda = require('../../../src/handlers/generate.js');

describe('Test generateRequestHandler', () => {
    it('should return 200', async () => {

        const event = {
            httpMethod: 'GET',
            queryStringParameters: {
                download: undefined,
                bundleSetupScripts: undefined,
                network: "testnet",
                version: "1.29.0",
                sshKey: "ssh-rsa\  fakekeygsgfdfds+fDFsdfHFr443trtgreGTREgetr4t3grgrGRegr3GRggfg34456768976976ijuykiuulJGgdefwedqwr24r36t4rgerGFEGerwcsdfakekeyfakekeygsgfdfdsfDFsdfHFr443trtgreGTREgetr4t3grgrGRegr3GRggfg34456768976976ijuykiuulJGgdefwedqwr24r36t4rgerGFEGerwcsdfakekeyfakekeygsgfdfdsfDFsdfHFr443trtgreGTREgetr4t3grgrGRegr3GRggfg34456768976976ijuykiuulJGgdefwedqwr24r36t4rgerGFEGerwcsdfakekeyfakekeygsgfdfdsfDFsdfHFr443trtgreGTREgetr4t3grgrGRegr3GRggfg34456768976976ijuykiuulJGgdefwedqwr24r36t4rgerGFEGerwcsdfakekeyfakekeygsgfdfdsfDFsdfHFr443trtgreGTREgetr4t3grgrGRegr3GRggfg34456768976976ijuykiuulJGgdefwedqwr24r36t4rgerGFEGerwcsdfakekey",
                sshPort: "22",
                relayNodeHostname: "",
                relayNodeIps: "",
                blockNodeIps: "",
                numberRelayNodes: 1,
                relayNodeUseHostname: false,
                relayNodeUseIp: true,
                relayNode1Hostname: "",
                relayNode1Ip: "12.12.12.12",
                relayNode2Hostname: "",
                relayNode2Ip: "",
                relayNodeSwap: 4294967296,
                relayNodeUseSwap: true,
                blockNodeIp: "12.12.12.12",
                blockNodeUseIp: true,
                blockNodeSwap: 4294967296,
                blockNodeUseSwap: true,
                bundleSetupScripts: true,
                prepareRelayNode: true,
                prepareBlockNode: true,
            }
        };

        const result = await lambda.generateRequestHandler(event, {awsRequestId: "12345"}, () => {});
        expect(result.statusCode).toEqual(200);
    }, 30000);
});
