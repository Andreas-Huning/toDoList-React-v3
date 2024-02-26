<?php
                declare(strict_types=1);
                header("Access-Control-Allow-Origin: *");
                header("Access-Control-Allow-Methods: POST, OPTIONS"); // Erlaubt POST- und OPTIONS-Anfragen
                header("Access-Control-Allow-Headers: Content-Type"); // Erlaubt Content-Type Header
                

                #********** DATABASE CONFIGURATION **********#
				define('DB_SYSTEM',							'mysql');
				define('DB_HOST',							'localhost');
				define('DB_NAME',							'todo');
				define('DB_USER',							'root');
				define('DB_PWD',							'');


#*******************************************************************************************************#


                function dbConnect($dbname=DB_NAME) {
					// echo "Connecting to database";
					
					try {
						$PDO = new PDO(DB_SYSTEM . ":host=" . DB_HOST . "; dbname=$dbname; charset=utf8mb4", DB_USER, DB_PWD);				
					} catch(PDOException $error) {
                        // echo "dbConnect Fehler";
					}
					return $PDO;
				}


#*******************************************************************************************************#

                function sanitizeString( $value ){

					if($value !== Null){
						$value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, double_encode:false);
						$value = trim($value);	
						if( $value ==='' ){
							$value = NULL;
						}
					}
					return $value;				
				}


#*******************************************************************************************************#


                $post = file_get_contents('php://input');
                // echo "Received POST data: "; // Ausgabe der empfangenen POST-Daten
                // var_dump($post); // Ausgabe des POST-Inhalts mit var_dump()

                if ($post) {
                    $requestData = json_decode($post, true);
                
                    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
                        header("Content-Type: application/json");
                    }
                
                    // erstes Laden beim Starten der Seite
                    if ($requestData['action'] === 'LOAD') {
                        
                        $PDO = dbConnect();
                        $sql	=	"SELECT * from toDoList LIMIT 5 OFFSET 0";                                            
                        $params 	= array();
        
                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);						
                            
                        } catch(PDOException $error) {
                            // echo "Datenbanktabellen Fehler";
                        }
                        $toDoArray = $PDOStatement -> fetchAll(\PDO::FETCH_ASSOC);
                        unset($PDO,$PDOStatement);
                        echo json_encode($toDoArray);

                    }// erstes Laden beim Starten der Seite END 

                    // Hinzufügen eines Datensatzes
                    if ($requestData['action'] === 'ADD') 
                    {                        

                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']['toDoListName']) ;
                        $toDoListName = sanitizeString($toDo['toDo']['toDoListName']);
                        $toDoListStatus = $toDo['toDo']['toDoListStatus'];
                        $toDoListDate = sanitizeString($toDo['toDo']['toDoListDate']);
                        $sqlDateTime = null;

                        if($toDoListDate) 
                        {
                            $dateString = $toDoListDate;
                            $timestamp = strtotime($dateString);
                            $sqlDateTime = date('Y-m-d H:i:s', $timestamp);
                        }

                        $PDO = dbConnect();
                        $sql = "INSERT INTO toDoList (toDoListName, toDoListStatus, toDoListDate) VALUES (:toDoListName, :toDoListStatus, :toDoListDate)";
                        $params = array(
                            ':toDoListName' => $toDoListName,
                            ':toDoListStatus' => $toDoListStatus,
                            ':toDoListDate' => $sqlDateTime
                        );

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $rowCount = $PDOStatement->rowCount();

                            if($rowCount !== 1) 
                            {
                                echo json_encode(array("message" => "Es wurden keine Daten gespeichert."));
                            } else 
                            {
                                $newToDoID = $PDO->lastInsertId();
                                echo json_encode(array("message" => "ToDo erfolgreich unter ID: $newToDoID gespeichert."));
                            }
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);     

                    }// Hinzufügen eines Datensatzes END

                    // Datensätze nach Usereingabe laden (Anzahl der Datensätze und Startpunkt)
                    if($requestData['action'] === 'LOADCUSTOM')
                    {                        
                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']['limit']) ;
                        $limit = (int)$toDo['toDo']['limit'];
                        $offset = (int)$toDo['toDo']['offset'];

                        $PDO = dbConnect();
                        $sql = "SELECT * FROM toDoList LIMIT $limit OFFSET $offset";
                        $params = array();

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $toDoArray = $PDOStatement->fetchAll(PDO::FETCH_ASSOC);
                            
                            echo json_encode($toDoArray);
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);

                    }// Datensätze nach Usereingabe laden (Anzahl der Datensätze und Startpunkt) END


                    // Löschen eines Datensatzes
                    if($requestData['action'] === 'DEL')
                    {                       
                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']['toDo']) ;
                        $id = (int)$toDo['toDo']['toDo'];

                        $PDO = dbConnect();
                        $sql = "DELETE FROM toDoList WHERE toDoListId = :id";
                        $params = array(':id' => $id);

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $rowCount = $PDOStatement->rowCount();

                            if($rowCount !== 1 ) {
                                echo json_encode(array("message" => "Es wurden keine Daten gespeichert."));
                            } else {
                                echo json_encode(array("message" => "ToDo ID: $id gelöscht."));
                            }
                        } catch(PDOException $error) {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }
                        unset($PDO, $PDOStatement);

                    } // Löschen eines Datensatzes END

                    // Update eines Datensatzes
                    if ($requestData['action'] === 'EDIT') 
                    {                        

                        $toDo = $requestData['toDo'];
                        // var_dump($toDo['toDo']) ;
                        $toDoListId = $toDo['toDo']['toDoListId'];
                        $toDoListName = sanitizeString($toDo['toDo']['toDoListName']);
                        $toDoListStatus = $toDo['toDo']['toDoListStatus'];
                        $toDoListDate = sanitizeString($toDo['toDo']['toDoListDate']);
                        $sqlDateTime = null;

                        if($toDoListDate) 
                        {
                            $dateString = $toDoListDate;
                            $timestamp = strtotime($dateString);
                            $sqlDateTime = date('Y-m-d H:i:s', $timestamp);
                        }

                        $PDO = dbConnect();
                        $sql = "UPDATE toDoList 
                        SET toDoListName = :toDoListName, 
                            toDoListStatus = :toDoListStatus, 
                            toDoListDate = :toDoListDate
                        WHERE toDoListId = :toDoListId";
                
                        $params = array(
                            ':toDoListName' => $toDoListName,
                            ':toDoListStatus' => $toDoListStatus,
                            ':toDoListDate' => $sqlDateTime,
                            ':toDoListId' => (int)$toDoListId
                        );
                

                        try {
                            $PDOStatement = $PDO->prepare($sql);
                            $PDOStatement->execute($params);
                            $rowCount = $PDOStatement->rowCount();

                            if($rowCount !== 1) 
                            {
                                echo json_encode(array("message" => "Es wurden keine Daten geändert."));
                            } else 
                            {
                                echo json_encode(array("message" => "ToDo ID: $toDoListId erfolgreich geändert."));
                            }
                        } catch(PDOException $error) 
                        {
                            echo json_encode(array("message" => "Datenbanktabellen Fehler: " . $error->getMessage()));
                        }

                        unset($PDO, $PDOStatement);     

                    }// Hinzufügen eines Datensatzes END


                }//POST END
            

#*******************************************************************************************************#