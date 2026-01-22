import java.util.HashMap;
import java.util.Map;
//Java version
public class morse {
    
    private static final Map<Character, String> textToMorse = new HashMap<>();
    private static final Map<String, Character> morseToText = new HashMap<>();
    
    // Initialize the conversion maps
    static {
        // Letters
        textToMorse.put('A', ".-");
        textToMorse.put('B', "-...");
        textToMorse.put('C', "-.-.");
        textToMorse.put('D', "-..");
        textToMorse.put('E', ".");
        textToMorse.put('F', "..-.");
        textToMorse.put('G', "--.");
        textToMorse.put('H', "....");
        textToMorse.put('I', "..");
        textToMorse.put('J', ".---");
        textToMorse.put('K', "-.-");
        textToMorse.put('L', ".-..");
        textToMorse.put('M', "--");
        textToMorse.put('N', "-.");
        textToMorse.put('O', "---");
        textToMorse.put('P', ".--.");
        textToMorse.put('Q', "--.-");
        textToMorse.put('R', ".-.");
        textToMorse.put('S', "...");
        textToMorse.put('T', "-");
        textToMorse.put('U', "..-");
        textToMorse.put('V', "...-");
        textToMorse.put('W', ".--");
        textToMorse.put('X', "-..-");
        textToMorse.put('Y', "-.--");
        textToMorse.put('Z', "--..");
        
        // Numbers
        textToMorse.put('0', "-----");
        textToMorse.put('1', ".----");
        textToMorse.put('2', "..---");
        textToMorse.put('3', "...--");
        textToMorse.put('4', "....-");
        textToMorse.put('5', ".....");
        textToMorse.put('6', "-....");
        textToMorse.put('7', "--...");
        textToMorse.put('8', "---..");
        textToMorse.put('9', "----.");
        
        // Special characters
        textToMorse.put('.', ".-.-.-");
        textToMorse.put(',', "--..--");
        textToMorse.put('?', "..--..");
        textToMorse.put('\'', ".----.");
        textToMorse.put('!', "-.-.--");
        textToMorse.put('/', "-..-.");
        textToMorse.put('(', "-.--.");
        textToMorse.put(')', "-.--.-");
        textToMorse.put('&', ".-...");
        textToMorse.put(':', "---...");
        textToMorse.put(';', "-.-.-.");
        textToMorse.put('=', "-...-");
        textToMorse.put('+', ".-.-.");
        textToMorse.put('-', "-....-");
        textToMorse.put('_', "..--.-");
        textToMorse.put('"', ".-..-.");
        textToMorse.put('$', "...-..-");
        textToMorse.put('@', ".--.-.");
        
        // Build reverse map (morse to text)
        for (Map.Entry<Character, String> entry : textToMorse.entrySet()) {
            morseToText.put(entry.getValue(), entry.getKey());
        }
    }
    
    /**
      Converts text to Morse code
      @param text The text to convert
      @return Morse code with letters separated by spaces and words by " / "
     */
    public static String textToMorse(String text) {
        StringBuilder morse = new StringBuilder();
        text = text.toUpperCase();
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            
            if (c == ' ') {
                morse.append(" / ");
            } else if (textToMorse.containsKey(c)) {
                morse.append(textToMorse.get(c)).append(" ");
            }
        }
        
        return morse.toString().trim();
    }
    
    /**
     * Converts Morse code to text
     * @param morse Morse code with letters separated by spaces and words by " / "
     * @return The decoded text
     */
    public static String morseToText(String morse) {
        StringBuilder text = new StringBuilder();
        String[] words = morse.split(" / ");
        
        for (String word : words) {
            String[] letters = word.split(" ");
            
            for (String letter : letters) {
                if (morseToText.containsKey(letter)) {
                    text.append(morseToText.get(letter));
                }
            }
            
            text.append(" ");
        }
        
        return text.toString().trim();
    }
    
    // Test the converter
    public static void main(String[] args) {
        // Test text to Morse
        String text1 = "Hello World";
        String morse1 = textToMorse(text1);
        System.out.println("Text: " + text1);
        System.out.println("Morse: " + morse1);
        System.out.println();
        
        // Test Morse to text
        String morse2 = "... --- ...";
        String text2 = morseToText(morse2);
        System.out.println("Morse: " + morse2);
        System.out.println("Text: " + text2);
        System.out.println();
        
        // Test round trip
        String original = "SOS 123";
        String toMorse = textToMorse(original);
        String backToText = morseToText(toMorse);
        System.out.println("Original: " + original);
        System.out.println("To Morse: " + toMorse);
        System.out.println("Back to Text: " + backToText);
    }
}