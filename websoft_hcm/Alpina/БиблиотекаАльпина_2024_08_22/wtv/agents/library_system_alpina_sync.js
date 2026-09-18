iLibrarySystemId = ArrayOptFirstElem(XQuery("for $elem in library_systems where $elem/code='alpina' return $elem")).id;
CallServerMethod( 'tools', 'call_library_system_method',[iLibrarySystemId,"syncData",{}]);
CallServerMethod( 'tools', 'call_library_system_method',[iLibrarySystemId,"syncStatistics",{}]);