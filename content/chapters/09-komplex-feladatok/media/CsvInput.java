import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/** A mintafájl beolvasására szolgáló segédosztály. */
public class CsvInput {
    public static List<String[]> readRows(String fileName) throws IOException {
        List<String[]> rows = new ArrayList<>();
        for (String line : Files.readAllLines(Path.of(fileName), StandardCharsets.UTF_8)) {
            if (line.isBlank()) continue;
            String[] fields = line.split(";", -1);
            if ((fields[0].equals("H") && fields.length != 5)
                    || (fields[0].equals("M") && fields.length != 7)
                    || (!fields[0].equals("H") && !fields[0].equals("M"))) {
                throw new IllegalArgumentException("Invalid CSV row: " + line);
            }
            rows.add(fields);
        }
        return rows;
    }
}
