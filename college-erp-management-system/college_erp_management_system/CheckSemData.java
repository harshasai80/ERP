import java.sql.*;

public class CheckSemData {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/college_erp"; 
        String user = "root";
        String pass = "Harsha123";

        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("--- DCS STUDENT LIST ---");
            String studentQuery = "SELECT name, registration_number, sem, section FROM students WHERE department = 'DCS'";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(studentQuery)) {
                while (rs.next()) {
                    System.out.println(String.format("Name: %s | Reg: %s | Sem: %d | Sec: %s", rs.getString("name"), rs.getString("registration_number"), rs.getInt("sem"), rs.getString("section")));
                }
            }

            System.out.println("\n--- DCS SUBJECT LIST ---");
            String subjectQuery = "SELECT subject_name, subject_code, semester FROM subject WHERE department = 'DCS'";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(subjectQuery)) {
                while (rs.next()) {
                    System.out.println(String.format("Name: %s | Code: %s | Sem: %d", rs.getString("subject_name"), rs.getString("subject_code"), rs.getInt("semester")));
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
