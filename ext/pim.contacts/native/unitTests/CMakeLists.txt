cmake_minimum_required(VERSION 2.8)

if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -fexceptions -lang-c++ ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror ${CMAKE_C_FLAGS}")
endif ()

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/dependencies/gmock-1.5.0/fused-src/)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/JsonCpp/jsoncpp-src-0.5.0/include)

set(srcs
    test_main.cpp
    ../pim_contacts_qt.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_reader.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_value.cpp
    ../../../../dependencies/JsonCpp/jsoncpp-src-0.5.0/src/lib_json/json_writer.cpp
    ../../../../dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cc
)

add_definitions(-DXP_UNIX)
add_executable(pimContactsTest ${srcs})

target_link_libraries(pimContactsTest m bbpim QtCore QtSql QtXml img)
set_target_properties(pimContactsTest PROPERTIES PREFIX "" OUTPUT_NAME "test")
