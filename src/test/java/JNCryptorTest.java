import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.cryptonode.jncryptor.AES256JNCryptor;
import org.cryptonode.jncryptor.CryptorException;
import org.junit.jupiter.api.Test;

class JNCryptorTest {

	@Test
	void test() throws CryptorException {
		String password = "<<ENCRYPTION KEY>>";
    	String encrypt = "AwFBXgrCIYMTS3QiTITu6TBcVNkxZVVzNWcrewnOMx1uvNuLFAMNcp9UuHziIeD1kNoR8OaU3sqNZlPBFosl6wPPNtGWBi+n+q9eCIRrUbfBgY6MEdteLS9nhWzPssn0WX4=";
	
    	AES256JNCryptor cryptor = new AES256JNCryptor();
    	cryptor.setPBKDFIterations(1000);
    	
    	byte[] decryptData = cryptor.decryptData(Base64.getDecoder().decode(encrypt), password.toCharArray());
    	System.out.printf("Decrypt AES256v3Cipher: %s%n", new String(decryptData, StandardCharsets.UTF_8));
	}

}
